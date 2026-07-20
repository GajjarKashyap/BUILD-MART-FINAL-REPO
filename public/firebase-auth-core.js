(function () {
    'use strict';

    const path = window.location.pathname.toLowerCase();
    const isProtected = !['shop.html', 'preview-store.html', '404.html']
        .some(page => path.endsWith(page));
    if (!isProtected) return;

    const savedEmailKey = 'buildmart_firebase_owner_email';
    let overlay;

    function setError(message) {
        const box = document.getElementById('authErrorMsg');
        if (!box) return;
        box.textContent = message;
        box.style.display = message ? 'block' : 'none';
    }

    function setBusy(busy) {
        const button = document.getElementById('authSubmitBtn');
        if (!button) return;
        button.disabled = busy;
        button.textContent = busy ? 'Checking account…' : 'Sign in securely';
    }

    function removeOverlay() {
        if (!overlay) return;
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay?.remove();
            overlay = null;
        }, 180);
    }

    function showOverlay() {
        if (overlay || document.getElementById('buildmartSecurityLockOverlay')) return;
        overlay = document.createElement('div');
        overlay.id = 'buildmartSecurityLockOverlay';
        overlay.style.cssText = 'position:fixed;inset:0;z-index:999999;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(17,24,39,.96);backdrop-filter:blur(16px);font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;transition:opacity .18s ease';
        overlay.innerHTML = `
            <div style="width:min(100%,430px);padding:38px;background:#fff;border:1px solid #e5e7eb;border-radius:20px;box-shadow:0 28px 70px rgba(0,0,0,.38)">
                <div style="width:58px;height:58px;margin:0 auto 18px;display:grid;place-items:center;border-radius:15px;background:#fff7ed;color:#ea580c;font-size:26px">🔐</div>
                <h2 style="margin:0 0 8px;text-align:center;font-size:23px;color:#111827">BuildMart owner sign in</h2>
                <p style="margin:0 0 24px;text-align:center;color:#6b7280;font-size:13.5px;line-height:1.55">Use the Email/Password account created in Firebase Authentication. Your password goes directly to Firebase and is never saved by BuildMart.</p>
                <form id="authLockForm">
                    <label style="display:block;margin-bottom:7px;color:#374151;font-size:12px;font-weight:700">OWNER EMAIL</label>
                    <input id="authEmailInput" type="email" autocomplete="username" required placeholder="owner@example.com" value="${(localStorage.getItem(savedEmailKey) || '').replace(/"/g, '&quot;')}" style="box-sizing:border-box;width:100%;padding:13px 14px;margin-bottom:14px;border:1.5px solid #d1d5db;border-radius:10px;font-size:15px;outline:none">
                    <label style="display:block;margin-bottom:7px;color:#374151;font-size:12px;font-weight:700">FIREBASE PASSWORD</label>
                    <input id="authPasswordInput" type="password" autocomplete="current-password" required placeholder="Enter your Firebase password" style="box-sizing:border-box;width:100%;padding:13px 14px;border:1.5px solid #d1d5db;border-radius:10px;font-size:15px;outline:none">
                    <div id="authErrorMsg" style="display:none;margin:14px 0 0;padding:10px 12px;border-radius:8px;background:#fef2f2;color:#b91c1c;font-size:12.5px;font-weight:600"></div>
                    <button id="authSubmitBtn" type="submit" style="width:100%;margin-top:18px;padding:14px;border:0;border-radius:10px;background:#111827;color:#fff;font-size:14.5px;font-weight:700;cursor:pointer">Sign in securely</button>
                </form>
                <p style="margin:18px 0 0;text-align:center;color:#9ca3af;font-size:11.5px">Owner UID protected • Firestore rules control every write</p>
            </div>`;
        document.documentElement.appendChild(overlay);

        document.getElementById('authLockForm').addEventListener('submit', async event => {
            event.preventDefault();
            setError('');
            setBusy(true);
            const email = document.getElementById('authEmailInput').value.trim();
            const password = document.getElementById('authPasswordInput').value;
            try {
                if (!window.BuildMartFirebase) throw new Error('Firebase is still loading. Wait a moment and retry.');
                await window.BuildMartFirebase.signIn(email, password);
                localStorage.setItem(savedEmailKey, email);
                document.getElementById('authPasswordInput').value = '';
                removeOverlay();
                injectLockButton();
            } catch (error) {
                const known = {
                    'auth/invalid-credential': 'Email or password is incorrect.',
                    'auth/invalid-email': 'Enter a valid email address.',
                    'auth/too-many-requests': 'Too many attempts. Wait a few minutes and retry.'
                };
                setError(known[error.code] || error.message || 'Sign in failed.');
                document.getElementById('authPasswordInput').value = '';
                document.getElementById('authPasswordInput').focus();
            } finally {
                setBusy(false);
            }
        });
    }

    function injectLockButton() {
        const add = () => {
            const nav = document.querySelector('.navbar-nav') || document.querySelector('.nav-links');
            if (!nav || document.getElementById('lockWorkspaceBtn')) return;
            const item = document.createElement('li');
            item.className = 'nav-item';
            item.innerHTML = '<button id="lockWorkspaceBtn" type="button" class="nav-link text-danger" style="border:0;background:transparent;cursor:pointer">🔒 Sign out</button>';
            item.querySelector('button').addEventListener('click', window.lockBuildMartWorkspace);
            nav.appendChild(item);
        };
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', add, { once: true });
        else add();
    }

    window.lockBuildMartWorkspace = async function () {
        try {
            await window.BuildMartFirebase?.signOut();
        } finally {
            showOverlay();
        }
    };

    window.addEventListener('buildmart-auth-changed', event => {
        const user = event.detail?.user;
        if (user && window.BuildMartFirebase?.isOwner(user)) {
            removeOverlay();
            injectLockButton();
        } else {
            showOverlay();
        }
    });

    showOverlay();
    const waitForFirebase = setInterval(() => {
        if (!window.BuildMartFirebase) return;
        clearInterval(waitForFirebase);
        window.BuildMartFirebase.ready
            .then(() => {
                const user = window.BuildMartFirebase.currentUser();
                if (user && window.BuildMartFirebase.isOwner(user)) {
                    removeOverlay();
                    injectLockButton();
                }
            })
            .catch(error => setError(`Firebase connection failed: ${error.message}`));
    }, 50);
    setTimeout(() => clearInterval(waitForFirebase), 20000);
})();
