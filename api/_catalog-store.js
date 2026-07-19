const crypto = require('crypto');

const API_VERSION = '2026-07-19';
const MAX_OPERATIONS = 100;
const MAX_PROCESSED_IDS = 1000;

function getConfig() {
    const repository = process.env.GITHUB_REPOSITORY || '';
    const [owner, repo] = repository.split('/');
    const config = {
        owner,
        repo,
        branch: process.env.GITHUB_BRANCH || 'main',
        path: process.env.GITHUB_DATA_PATH || 'buildmart_backup_2026-07-19.json',
        token: process.env.GITHUB_TOKEN || '',
        adminSecret: process.env.SYNC_ADMIN_SECRET || ''
    };
    if (!config.owner || !config.repo || !config.token || !config.adminSecret) {
        throw new Error('The catalog sync service is not fully configured.');
    }
    return config;
}

function allowedOrigins() {
    return [
        process.env.ALLOWED_ORIGIN,
        ...(process.env.ALLOWED_ORIGINS || '').split(',')
    ].map(value => String(value || '').trim().replace(/\/$/, '')).filter(Boolean);
}

function applyCors(req, res) {
    const origin = String(req.headers.origin || '').replace(/\/$/, '');
    const allowed = allowedOrigins();
    const allowLocal = process.env.ALLOW_LOCAL_ORIGIN === 'true';
    const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
    if (allowed.includes(origin) || (allowLocal && (origin === 'null' || isLocal))) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Vary', 'Origin');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,X-BuildMart-Admin-Secret');
    res.setHeader('Access-Control-Max-Age', '86400');
    res.setHeader('Cache-Control', 'no-store');
}

function requireAdmin(req, res, config) {
    const supplied = String(req.headers['x-buildmart-admin-secret'] || '');
    const expected = String(config.adminSecret || '');
    const suppliedBuffer = Buffer.from(supplied);
    const expectedBuffer = Buffer.from(expected);
    const valid = suppliedBuffer.length === expectedBuffer.length
        && suppliedBuffer.length > 0
        && crypto.timingSafeEqual(suppliedBuffer, expectedBuffer);
    if (!valid) {
        res.status(401).json({ ok: false, error: 'Owner authentication is required.' });
        return false;
    }
    return true;
}

function githubHeaders(config) {
    return {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${config.token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'BuildMart-Catalog-Sync'
    };
}

function githubFileUrl(config) {
    const encodedPath = config.path.split('/').map(encodeURIComponent).join('/');
    return `https://api.github.com/repos/${encodeURIComponent(config.owner)}/${encodeURIComponent(config.repo)}/contents/${encodedPath}`;
}

async function readCatalog(config) {
    const response = await fetch(`${githubFileUrl(config)}?ref=${encodeURIComponent(config.branch)}`, {
        headers: githubHeaders(config)
    });
    if (!response.ok) {
        const details = await response.text();
        throw new Error(`GitHub read failed (${response.status}): ${details.slice(0, 240)}`);
    }
    const file = await response.json();
    const text = Buffer.from(String(file.content || '').replace(/\n/g, ''), 'base64').toString('utf8');
    const catalog = JSON.parse(text);
    catalog.metadata = catalog.metadata || {};
    catalog.products = Array.isArray(catalog.products) ? catalog.products : [];
    catalog.archived_products = Array.isArray(catalog.archived_products) ? catalog.archived_products : [];
    catalog.metadata.sync = catalog.metadata.sync || {};
    catalog.metadata.sync.processed_operation_ids =
        Array.isArray(catalog.metadata.sync.processed_operation_ids)
            ? catalog.metadata.sync.processed_operation_ids
            : [];
    return { catalog, sha: file.sha };
}

async function writeCatalog(config, catalog, sha, operationCount, messageOverride = '') {
    const body = {
        message: messageOverride || `Sync ${operationCount} BuildMart catalog operation${operationCount === 1 ? '' : 's'}`,
        content: Buffer.from(`${JSON.stringify(catalog, null, 2)}\n`, 'utf8').toString('base64'),
        sha,
        branch: config.branch
    };
    const response = await fetch(githubFileUrl(config), {
        method: 'PUT',
        headers: { ...githubHeaders(config), 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    if (!response.ok) {
        const details = await response.text();
        const error = new Error(`GitHub update failed (${response.status}): ${details.slice(0, 240)}`);
        error.status = response.status;
        throw error;
    }
    return response.json();
}

function validateSnapshot(snapshot) {
    if (!snapshot || typeof snapshot !== 'object' || !Array.isArray(snapshot.products)) {
        const error = new Error('The browser catalog is not a valid BuildMart dataset.');
        error.status = 400;
        throw error;
    }
    if (snapshot.products.length > 5000) {
        const error = new Error('The catalog is larger than the 5,000-product safety limit.');
        error.status = 413;
        throw error;
    }
    const seen = new Set();
    snapshot.products.forEach((product, index) => {
        const sku = String(product?.sku || '').trim();
        if (!sku) {
            const error = new Error(`Product ${index + 1} has no SKU.`);
            error.status = 400;
            throw error;
        }
        if (seen.has(sku)) {
            const error = new Error(`Duplicate SKU found: ${sku}. Fix it before Super Save.`);
            error.status = 409;
            throw error;
        }
        seen.add(sku);
    });
}

async function superSaveCatalog(config, snapshot) {
    validateSnapshot(snapshot);

    for (let attempt = 0; attempt < 3; attempt++) {
        const { catalog: remote, sha } = await readCatalog(config);
        const now = new Date().toISOString();
        const incomingSkus = new Set(snapshot.products.map(product => product.sku));
        const archivedBySku = new Map(
            (remote.archived_products || []).map(product => [product.sku, product])
        );

        remote.products
            .filter(product => !incomingSkus.has(product.sku))
            .forEach(product => {
                archivedBySku.set(product.sku, {
                    ...product,
                    archived_at: now,
                    archive_reason: 'Missing from confirmed Super Save snapshot'
                });
            });

        const nextCatalog = {
            metadata: {
                ...(remote.metadata || {}),
                ...(snapshot.metadata || {}),
                sync: {
                    ...(remote.metadata?.sync || {}),
                    last_updated_at: now,
                    api_version: API_VERSION,
                    mode: 'manual_super_save'
                },
                git_super_save: {
                    saved_at: now,
                    product_count: snapshot.products.length
                }
            },
            products: snapshot.products,
            archived_products: [...archivedBySku.values()]
        };
        nextCatalog.metadata.last_serial_id = nextCatalog.products.reduce(
            (max, product) => Math.max(max, Number(product.product_serial_id) || 0),
            Number(nextCatalog.metadata.last_serial_id) || 1000000
        );

        try {
            const result = await writeCatalog(
                config,
                nextCatalog,
                sha,
                snapshot.products.length,
                `Super Save BuildMart catalog (${snapshot.products.length} products)`
            );
            return {
                summary: catalogSummary(nextCatalog, result.content?.sha || sha),
                commit: {
                    sha: result.commit?.sha || null,
                    url: result.commit?.html_url || null,
                    message: result.commit?.message || null
                }
            };
        } catch (error) {
            if (error.status !== 409 || attempt === 2) throw error;
        }
    }
    throw new Error('The GitHub file changed repeatedly. Press Super Save again.');
}

function timestamp(value) {
    const parsed = new Date(value || 0).getTime();
    return Number.isFinite(parsed) ? parsed : 0;
}

function stableJson(value) {
    if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`;
    if (value && typeof value === 'object') {
        return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(',')}}`;
    }
    return JSON.stringify(value);
}

function catalogSummary(catalog, sha) {
    const products = catalog.products || [];
    const archived = catalog.archived_products || [];
    const latest = [...products].sort((left, right) =>
        timestamp(right.updated_at || right.created_at) - timestamp(left.updated_at || left.created_at)
    )[0] || null;
    const sync = catalog.metadata.sync || {};
    return {
        sha,
        path: getConfig().path,
        productCount: products.length,
        archivedCount: archived.length,
        lastUpdatedAt: sync.last_updated_at || latest?.updated_at || latest?.created_at || null,
        lastInsertedProduct: latest ? {
            sku: latest.sku,
            name: latest.name,
            updated_at: latest.updated_at || latest.created_at || null
        } : null,
        processedOperationCount: (sync.processed_operation_ids || []).length
    };
}

function applyOperations(catalog, operations) {
    const processed = new Set(catalog.metadata.sync.processed_operation_ids);
    const accepted = [];
    const skipped = [];
    const conflicts = [];

    for (const operation of operations) {
        const id = String(operation?.id || '').trim();
        const type = String(operation?.type || '');
        const sku = String(operation?.sku || operation?.product?.sku || '').trim();
        if (!id || !sku || !['upsert', 'archive'].includes(type)) {
            skipped.push({ id, sku, reason: 'invalid_operation' });
            continue;
        }
        if (processed.has(id)) {
            skipped.push({ id, sku, reason: 'already_processed' });
            continue;
        }

        const index = catalog.products.findIndex(product => product.sku === sku);
        const remote = index >= 0 ? catalog.products[index] : null;
        if (type === 'upsert') {
            const incoming = operation.product;
            if (!incoming || typeof incoming !== 'object') {
                skipped.push({ id, sku, reason: 'missing_product' });
                continue;
            }
            const remoteTime = timestamp(remote?.updated_at || remote?.created_at);
            const incomingTime = timestamp(incoming.updated_at || incoming.created_at);
            if (remote && remoteTime > incomingTime && stableJson(remote) !== stableJson(incoming)) {
                conflicts.push({
                    id,
                    sku,
                    reason: 'remote_is_newer',
                    localUpdatedAt: incoming.updated_at || incoming.created_at || null,
                    remoteUpdatedAt: remote.updated_at || remote.created_at || null,
                    remoteProduct: remote
                });
                continue;
            }
            if (index >= 0) catalog.products[index] = incoming;
            else catalog.products.push(incoming);
        } else {
            const archivedProduct = remote || operation.product;
            if (archivedProduct) {
                const archiveEntry = {
                    ...archivedProduct,
                    archived_at: operation.createdAt || new Date().toISOString(),
                    archive_operation_id: id
                };
                const archiveIndex = catalog.archived_products.findIndex(product => product.sku === sku);
                if (archiveIndex >= 0) catalog.archived_products[archiveIndex] = archiveEntry;
                else catalog.archived_products.push(archiveEntry);
            }
            if (index >= 0) catalog.products.splice(index, 1);
        }

        processed.add(id);
        accepted.push({ id, sku, type });
    }

    catalog.metadata.sync.processed_operation_ids = [...processed].slice(-MAX_PROCESSED_IDS);
    if (accepted.length) {
        catalog.metadata.sync.last_updated_at = new Date().toISOString();
        catalog.metadata.sync.last_operation_count = accepted.length;
        catalog.metadata.sync.api_version = API_VERSION;
    }
    const highestSerial = catalog.products.reduce((max, product) =>
        Math.max(max, Number(product.product_serial_id) || 0), Number(catalog.metadata.last_serial_id) || 0
    );
    catalog.metadata.last_serial_id = highestSerial;
    return { accepted, skipped, conflicts };
}

async function syncCatalog(config, operations) {
    if (!Array.isArray(operations) || operations.length > MAX_OPERATIONS) {
        const error = new Error(`Send between 0 and ${MAX_OPERATIONS} operations per request.`);
        error.status = 400;
        throw error;
    }

    for (let attempt = 0; attempt < 3; attempt++) {
        const { catalog, sha } = await readCatalog(config);
        const result = applyOperations(catalog, operations);
        if (!result.accepted.length) {
            return { ...result, summary: catalogSummary(catalog, sha) };
        }
        try {
            const updated = await writeCatalog(config, catalog, sha, result.accepted.length);
            return {
                ...result,
                summary: catalogSummary(catalog, updated.content?.sha || sha)
            };
        } catch (error) {
            if (error.status !== 409 || attempt === 2) throw error;
        }
    }
    throw new Error('Catalog changed repeatedly while syncing. Retry in a moment.');
}

module.exports = {
    API_VERSION,
    applyCors,
    catalogSummary,
    getConfig,
    readCatalog,
    requireAdmin,
    superSaveCatalog,
    syncCatalog
};
