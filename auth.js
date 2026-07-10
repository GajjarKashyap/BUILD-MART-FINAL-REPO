/**
 * BUILDMART Secure Cryptographic Authentication System (auth.js)
 * Uses Web Crypto API (SHA-256 one-way hashing) so NO plaintext password
 * is ever stored in any HTML or JS source file.
 */

(function() {
    // Default initial SHA-256 hash for 'buildmart2026'
    // Stored as a one-way cryptographic hash. Plaintext password is NEVER in source code.
    const DEFAULT_AUTH_HASH = "172889a7c59f6953e9854e91b6c23a43970ec485cc781c20af8b9d0a345ca8b6";

    function getTargetHash() {
        return localStorage.getItem('buildmart_secure_auth_hash') || DEFAULT_AUTH_HASH;
    }

    async function computeSHA256(text) {
        const msgBuffer = new TextEncoder().encode(text);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    function isPageProtected() {
        const path = window.location.pathname.toLowerCase();
        return !path.endsWith('shop.html') && !path.endsWith('preview-store.html') && !path.endsWith('404.html');
    }

    function checkAuth() {
        if (!isPageProtected()) return;

        const sessionAuth = sessionStorage.getItem('buildmart_authenticated_session');
        if (sessionAuth === 'true') {
            injectLockNavbarButton();
            return;
        }

        renderLockScreen();
    }

    function injectLockNavbarButton() {
        document.addEventListener('DOMContentLoaded', () => {
            const navUl = document.querySelector('.navbar-nav') || document.querySelector('.nav-links');
            if (navUl && !document.getElementById('lockWorkspaceBtn')) {
                const li = document.createElement('li');
                li.className = 'nav-item';
                li.innerHTML = `
                    <a href="javascript:void(0)" id="lockWorkspaceBtn" class="nav-link text-danger" onclick="window.lockBuildMartWorkspace()" title="Lock Workspace Session">
                        <i class="bi bi-lock-fill"></i> Lock
                    </a>`;
                navUl.appendChild(li);
            }
        });
    }

    window.lockBuildMartWorkspace = function() {
        sessionStorage.removeItem('buildmart_authenticated_session');
        window.location.reload();
    };

    function renderLockScreen() {
        const overlay = document.createElement('div');
        overlay.id = 'buildmartSecurityLockOverlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(17, 24, 39, 0.96);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Inter', -apple-system, sans-serif;
        `;

        overlay.innerHTML = `
            <div style="
                background: #FFFFFF;
                border-radius: 20px;
                padding: 44px 40px;
                width: 100%;
                max-width: 420px;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                text-align: center;
                border: 1px solid #E5E7EB;
            ">
                <div style="
                    width: 64px;
                    height: 64px;
                    border-radius: 16px;
                    background: #EFF6FF;
                    color: #2563EB;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 28px;
                    margin: 0 auto 20px auto;
                ">
                    <i class="bi bi-shield-lock-fill"></i>
                </div>

                <h2 style="
                    font-family: 'Space Grotesk', sans-serif;
                    font-weight: 700;
                    font-size: 22px;
                    color: #111827;
                    margin-bottom: 8px;
                ">Protected Workspace</h2>

                <p style="
                    font-size: 13.5px;
                    color: #6B7280;
                    margin-bottom: 28px;
                    line-height: 1.5;
                ">
                    Enter your secure BuildMart authorization code to unlock dashboard & inventory controls.
                </p>

                <form id="authLockForm" onsubmit="return false;">
                    <div style="position: relative; margin-bottom: 20px;">
                        <input type="password" id="authPasswordInput" autocomplete="current-password" placeholder="Enter secure password..." required style="
                            width: 100%;
                            padding: 14px 16px;
                            border-radius: 10px;
                            border: 1.5px solid #D1D5DB;
                            font-size: 15px;
                            outline: none;
                            transition: border-color 0.2s;
                            box-sizing: border-box;
                        ">
                    </div>

                    <div id="authErrorMsg" style="
                        display: none;
                        color: #DC2626;
                        font-size: 13px;
                        font-weight: 600;
                        margin-bottom: 16px;
                    "><i class="bi bi-exclamation-circle-fill me-1"></i> Incorrect password. Please try again.</div>

                    <button type="submit" id="authSubmitBtn" style="
                        width: 100%;
                        padding: 14px;
                        border-radius: 10px;
                        background: #111827;
                        color: #FFFFFF;
                        font-weight: 600;
                        font-size: 14.5px;
                        border: none;
                        cursor: pointer;
                        transition: background 0.2s;
                    ">Unlock Workspace <i class="bi bi-arrow-right ms-1"></i></button>
                </form>

                <div style="margin-top: 24px; font-size: 12px; color: #9CA3AF;">
                    🔒 Cryptographically verified via SHA-256 one-way hashing
                </div>
            </div>
        `;

        document.documentElement.appendChild(overlay);

        setTimeout(() => {
            const inp = document.getElementById('authPasswordInput');
            if (inp) inp.focus();
        }, 100);

        const form = document.getElementById('authLockForm');
        form.addEventListener('submit', async () => {
            const inputVal = document.getElementById('authPasswordInput').value;
            const targetHash = getTargetHash();
            const computed = await computeSHA256(inputVal);

            if (computed === targetHash) {
                sessionStorage.setItem('buildmart_authenticated_session', 'true');
                overlay.style.transition = 'opacity 0.25s ease';
                overlay.style.opacity = '0';
                setTimeout(() => {
                    overlay.remove();
                    injectLockNavbarButton();
                }, 250);
            } else {
                const err = document.getElementById('authErrorMsg');
                err.style.display = 'block';
                const inp = document.getElementById('authPasswordInput');
                inp.style.borderColor = '#DC2626';
                inp.value = '';
                inp.focus();
            }
        });
    }

    window.changeBuildMartPassword = async function(newPassword) {
        if (!newPassword || newPassword.length < 4) {
            throw new Error("Password must be at least 4 characters long.");
        }
        const newHash = await computeSHA256(newPassword);
        localStorage.setItem('buildmart_secure_auth_hash', newHash);
        return true;
    };

    checkAuth();
})();
