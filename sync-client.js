(function () {
    'use strict';

    const API_BASE = 'https://build-mart-final-repo.vercel.app';
    const QUEUE_KEY = 'buildmart_sync_queue_v1';
    const STATUS_KEY = 'buildmart_sync_status_v1';
    const NEW_SAVE_COUNT_KEY = 'buildmart_new_save_count_v1';
    const SECRET_KEY = 'buildmart_sync_admin_secret';
    const BACKUP_EVERY = 5;
    let syncPromise = null;

    function readJson(key, fallback) {
        try {
            const value = JSON.parse(localStorage.getItem(key));
            return value == null ? fallback : value;
        } catch (_) {
            return fallback;
        }
    }

    function writeJson(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function queue() {
        const value = readJson(QUEUE_KEY, []);
        return Array.isArray(value) ? value : [];
    }

    function saveQueue(value) {
        writeJson(QUEUE_KEY, value);
        window.dispatchEvent(new CustomEvent('buildmart-sync-changed'));
    }

    function status() {
        return {
            pendingCount: queue().length,
            online: navigator.onLine,
            ...readJson(STATUS_KEY, {})
        };
    }

    function setStatus(patch) {
        const next = { ...readJson(STATUS_KEY, {}), ...patch };
        writeJson(STATUS_KEY, next);
        window.dispatchEvent(new CustomEvent('buildmart-sync-changed'));
        return next;
    }

    function operationId() {
        if (crypto.randomUUID) return crypto.randomUUID();
        return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }

    function secret() {
        return sessionStorage.getItem(SECRET_KEY) || '';
    }

    function setSecret(value) {
        const normalized = String(value || '').trim();
        if (normalized) sessionStorage.setItem(SECRET_KEY, normalized);
        else sessionStorage.removeItem(SECRET_KEY);
        window.dispatchEvent(new CustomEvent('buildmart-sync-changed'));
    }

    function notify(message, tone) {
        let container = document.getElementById('buildmartSyncToast');
        if (!container) {
            container = document.createElement('div');
            container.id = 'buildmartSyncToast';
            Object.assign(container.style, {
                position: 'fixed',
                right: '18px',
                bottom: '18px',
                zIndex: '99999',
                maxWidth: '390px',
                padding: '12px 15px',
                borderRadius: '10px',
                boxShadow: '0 14px 36px rgba(15,23,42,.2)',
                font: '600 13px/1.45 Inter,system-ui,sans-serif',
                transition: 'opacity .2s ease, transform .2s ease'
            });
            document.body.appendChild(container);
        }
        container.textContent = message;
        container.style.background = tone === 'error' ? '#991b1b' : tone === 'warn' ? '#92400e' : '#143d2a';
        container.style.color = '#fff';
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
        clearTimeout(notify.timer);
        notify.timer = setTimeout(() => {
            container.style.opacity = '0';
            container.style.transform = 'translateY(8px)';
        }, 5200);
    }

    function enqueue(type, product) {
        if (!product || !product.sku) return;
        const items = queue();
        items.push({
            id: operationId(),
            type,
            sku: product.sku,
            product,
            createdAt: new Date().toISOString()
        });
        saveQueue(items);
        setStatus({ lastQueuedAt: new Date().toISOString(), lastQueuedSku: product.sku });
        if (navigator.onLine && secret()) syncNow().catch(() => {});
    }

    function backupFilename() {
        const date = new Date().toISOString().slice(0, 10);
        return `buildmart_backup_${date}.json`;
    }

    function downloadBackup() {
        if (!window.db || typeof window.db.getData !== 'function') return false;
        const data = window.db.getData();
        data.archived_products = Array.isArray(data.archived_products) ? data.archived_products : [];
        data.metadata = data.metadata || {};
        data.metadata.local_backup = {
            created_at: new Date().toISOString(),
            reason: `Automatic safety backup after ${BACKUP_EVERY} successful new-product saves`
        };
        const blob = new Blob([`${JSON.stringify(data, null, 2)}\n`], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = backupFilename();
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(link.href), 1000);
        setStatus({ lastLocalBackupAt: new Date().toISOString(), savesSinceBackup: 0 });
        notify('Safety backup downloaded. Your latest five new products are protected.');
        return true;
    }

    function recordProductSave(product, isEdit) {
        enqueue('upsert', product);
        if (isEdit) return;
        const count = Number(localStorage.getItem(NEW_SAVE_COUNT_KEY) || 0) + 1;
        if (count >= BACKUP_EVERY) {
            localStorage.setItem(NEW_SAVE_COUNT_KEY, '0');
            downloadBackup();
        } else {
            localStorage.setItem(NEW_SAVE_COUNT_KEY, String(count));
            setStatus({ savesSinceBackup: count });
            if (count === BACKUP_EVERY - 1) {
                notify('One more new product will create your automatic safety backup.', 'warn');
            }
        }
    }

    function recordArchive(product) {
        enqueue('archive', product);
    }

    async function api(path, options) {
        const response = await fetch(`${API_BASE}${path}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'X-BuildMart-Admin-Secret': secret(),
                ...(options?.headers || {})
            }
        });
        const result = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
        if (!response.ok && response.status !== 409) {
            const error = new Error(result.error || `Sync failed with HTTP ${response.status}.`);
            error.status = response.status;
            throw error;
        }
        return { response, result };
    }

    async function remoteStatus() {
        if (!secret()) throw new Error('Enter the sync admin secret first.');
        const { result } = await api('/api/sync', { method: 'GET' });
        setStatus({ remote: result.summary, lastCheckedAt: new Date().toISOString(), lastError: '' });
        return result.summary;
    }

    async function syncNow() {
        if (syncPromise) return syncPromise;
        syncPromise = (async () => {
            if (!navigator.onLine) throw new Error('You are offline. Changes remain safely queued.');
            if (!secret()) throw new Error('Enter the sync admin secret on Sync Safety before uploading.');
            const pending = queue();
            setStatus({ syncing: true, lastError: '' });
            if (!pending.length) {
                const remote = await remoteStatus();
                setStatus({ syncing: false, lastSuccessfulSyncAt: new Date().toISOString(), remote });
                return { accepted: [], skipped: [], conflicts: [], summary: remote };
            }

            const { result } = await api('/api/sync', {
                method: 'POST',
                body: JSON.stringify({ operations: pending.slice(0, 100) })
            });
            const completedIds = new Set([
                ...(result.accepted || []).map(item => item.id),
                ...(result.skipped || []).filter(item => item.reason === 'already_processed').map(item => item.id)
            ]);
            saveQueue(queue().filter(item => !completedIds.has(item.id)));
            const conflicts = result.conflicts || [];
            setStatus({
                syncing: false,
                lastSuccessfulSyncAt: new Date().toISOString(),
                lastError: '',
                remote: result.summary,
                conflicts
            });
            if (conflicts.length) {
                notify(`${conflicts.length} newer online change${conflicts.length === 1 ? '' : 's'} need review. Nothing was overwritten.`, 'warn');
            } else {
                notify(`${result.accepted?.length || 0} change${result.accepted?.length === 1 ? '' : 's'} safely synchronized.`);
            }
            return result;
        })().catch(error => {
            setStatus({ syncing: false, lastError: error.message, lastFailedAt: new Date().toISOString() });
            notify(error.message, 'error');
            throw error;
        }).finally(() => {
            syncPromise = null;
        });
        return syncPromise;
    }

    window.addEventListener('online', () => {
        setStatus({ online: true, reconnectedAt: new Date().toISOString() });
        if (secret()) syncNow().catch(() => {});
        else notify('Internet restored. Your saved changes are queued; open Sync Safety to connect.', 'warn');
    });
    window.addEventListener('offline', () => setStatus({ online: false }));

    window.BuildMartSync = {
        API_BASE,
        BACKUP_EVERY,
        downloadBackup,
        getQueue: queue,
        getSecret: secret,
        getStatus: status,
        recordArchive,
        recordProductSave,
        remoteStatus,
        setSecret,
        syncNow
    };
})();
