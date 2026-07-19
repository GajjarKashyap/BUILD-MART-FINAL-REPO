const { API_VERSION, applyCors } = require('./_catalog-store');

module.exports = async function handler(req, res) {
    applyCors(req, res);
    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== 'GET') return res.status(405).json({ ok: false, error: 'Method not allowed.' });

    const required = [
        'GITHUB_TOKEN',
        'GITHUB_REPOSITORY',
        'GITHUB_BRANCH',
        'GITHUB_DATA_PATH',
        'SYNC_ADMIN_SECRET',
        'ALLOWED_ORIGIN'
    ];
    const missing = required.filter(name => !process.env[name]);
    return res.status(missing.length ? 503 : 200).json({
        ok: missing.length === 0,
        service: 'BuildMart Catalog Sync',
        version: API_VERSION,
        configured: missing.length === 0,
        missing
    });
};
