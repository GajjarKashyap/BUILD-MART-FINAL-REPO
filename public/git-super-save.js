(function () {
    'use strict';

    const API_URL = 'https://build-mart-final-repo.vercel.app/api/super-save';
    const SECRET_KEY = 'buildmart_sync_admin_secret';
    const STATUS_KEY = 'buildmart_git_super_save_status';

    function setButton(button, state) {
        button.disabled = state === 'busy';
        button.innerHTML = state === 'busy'
            ? '<i class="bi bi-arrow-repeat"></i> Saving to Git…'
            : state === 'success'
                ? '<i class="bi bi-check2-circle"></i> Saved to Git'
                : '<i class="bi bi-shield-check"></i> Super Save to Git';
    }

    function toast(message, isError = false) {
        let element = document.getElementById('gitSuperSaveToast');
        if (!element) {
            element = document.createElement('div');
            element.id = 'gitSuperSaveToast';
            Object.assign(element.style, {
                position: 'fixed',
                right: '20px',
                bottom: '20px',
                zIndex: '99999',
                maxWidth: '420px',
                padding: '13px 16px',
                borderRadius: '9px',
                boxShadow: '0 16px 40px rgba(15,23,42,.22)',
                color: '#fff',
                font: '600 13px/1.5 Inter,system-ui,sans-serif'
            });
            document.body.appendChild(element);
        }
        element.style.background = isError ? '#991b1b' : '#143d2a';
        element.textContent = message;
        element.hidden = false;
        clearTimeout(toast.timer);
        toast.timer = setTimeout(() => { element.hidden = true; }, 6500);
    }

    function requestSecret() {
        const saved = sessionStorage.getItem(SECRET_KEY);
        if (saved) return saved;
        const entered = window.prompt(
            'Enter your SYNC_ADMIN_SECRET.\n\nIt stays only in this browser tab and is never saved in GitHub.'
        );
        const normalized = String(entered || '').trim();
        if (normalized) sessionStorage.setItem(SECRET_KEY, normalized);
        return normalized;
    }

    async function run(button) {
        if (!navigator.onLine) {
            toast('Internet connection is required for Super Save.', true);
            return;
        }
        if (!window.db || typeof window.db.getData !== 'function') {
            toast('Catalog data is not ready. Reload the dashboard.', true);
            return;
        }

        const catalog = window.db.getData();
        const count = Array.isArray(catalog.products) ? catalog.products.length : 0;
        if (!count) {
            toast('There are no products to save.', true);
            return;
        }
        const secret = requestSecret();
        if (!secret) return;
        if (!window.confirm(
            `Super Save ${count} products to GitHub?\n\n` +
            'This updates buildmart_backup_2026-07-19.json and creates a Git commit. ' +
            'Missing products are archived, not destroyed.'
        )) return;

        setButton(button, 'busy');
        const status = document.getElementById('workspaceSyncStatus');
        if (status) status.textContent = 'Saving complete catalog to Git…';

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-BuildMart-Admin-Secret': secret
                },
                body: JSON.stringify({ catalog })
            });
            const result = await response.json().catch(() => ({}));
            if (!response.ok) {
                if (response.status === 401) sessionStorage.removeItem(SECRET_KEY);
                throw new Error(result.error || `Super Save failed with HTTP ${response.status}.`);
            }

            const commitSha = String(result.commit?.sha || '').slice(0, 7);
            const productCount = result.summary?.productCount || count;
            localStorage.setItem(STATUS_KEY, JSON.stringify({
                savedAt: new Date().toISOString(),
                productCount,
                commitSha,
                commitUrl: result.commit?.url || ''
            }));
            setButton(button, 'success');
            button.title = commitSha ? `Git commit ${commitSha}` : 'Git commit created';
            if (status) status.textContent = commitSha
                ? `✓ Git commit ${commitSha} created`
                : '✓ Complete catalog saved to Git';
            toast(`${productCount} products saved safely. Git commit ${commitSha || 'created'}.`);
        } catch (error) {
            setButton(button, 'error');
            button.title = error.message;
            if (status) status.textContent = 'Super Save needs attention';
            toast(error.message, true);
        }
    }

    function restoreButtonStatus() {
        const button = document.getElementById('superSaveGitButton');
        if (!button) return;
        try {
            const status = JSON.parse(localStorage.getItem(STATUS_KEY));
            if (status?.savedAt) {
                button.title = `${status.productCount} products · ${new Date(status.savedAt).toLocaleString()}` +
                    (status.commitSha ? ` · commit ${status.commitSha}` : '');
            }
        } catch (_) {}
    }

    window.BuildMartGitSave = { run };
    window.addEventListener('DOMContentLoaded', restoreButtonStatus);
})();
