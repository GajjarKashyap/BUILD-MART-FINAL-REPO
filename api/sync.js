const {
    applyCors,
    catalogSummary,
    getConfig,
    readCatalog,
    requireAdmin,
    syncCatalog
} = require('./_catalog-store');

module.exports = async function handler(req, res) {
    applyCors(req, res);
    if (req.method === 'OPTIONS') return res.status(204).end();

    try {
        const config = getConfig();
        if (!requireAdmin(req, res, config)) return;

        if (req.method === 'GET') {
            const { catalog, sha } = await readCatalog(config);
            return res.status(200).json({ ok: true, summary: catalogSummary(catalog, sha) });
        }
        if (req.method === 'POST') {
            const operations = Array.isArray(req.body?.operations) ? req.body.operations : [];
            const result = await syncCatalog(config, operations);
            return res.status(result.conflicts.length ? 409 : 200).json({ ok: true, ...result });
        }
        return res.status(405).json({ ok: false, error: 'Method not allowed.' });
    } catch (error) {
        console.error('BuildMart sync error:', error);
        return res.status(error.status || 500).json({
            ok: false,
            error: error.message || 'Catalog sync failed.'
        });
    }
};
