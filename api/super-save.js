const {
    applyCors,
    getConfig,
    requireAdmin,
    superSaveCatalog
} = require('./_catalog-store');

module.exports = async function handler(req, res) {
    applyCors(req, res);
    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== 'POST') {
        return res.status(405).json({ ok: false, error: 'Method not allowed.' });
    }

    try {
        const config = getConfig();
        if (!requireAdmin(req, res, config)) return;
        const result = await superSaveCatalog(config, req.body?.catalog);
        return res.status(200).json({ ok: true, ...result });
    } catch (error) {
        console.error('BuildMart Super Save error:', error);
        return res.status(error.status || 500).json({
            ok: false,
            error: error.message || 'Super Save failed.'
        });
    }
};
