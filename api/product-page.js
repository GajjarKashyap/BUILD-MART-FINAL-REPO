const MAX_PRODUCT_PAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_PRODUCT_HOSTS = [
    'amazon.in',
    'amazon.com',
    'amzn.in',
    'flipkart.com'
];
const ALLOWED_ORIGINS = new Set([
    'https://gajjarkashyap.github.io',
    'https://build-mart-final-repo.vercel.app'
]);

function isAllowedProductHost(hostname) {
    const normalized = String(hostname || '').toLowerCase();
    return ALLOWED_PRODUCT_HOSTS.some(host =>
        normalized === host || normalized.endsWith(`.${host}`)
    );
}

function parseAllowedProductUrl(value) {
    let parsed;
    try {
        parsed = new URL(value);
    } catch {
        throw new Error('Enter a valid Amazon or Flipkart URL.');
    }
    if (parsed.protocol !== 'https:' || !isAllowedProductHost(parsed.hostname)) {
        throw new Error('Only HTTPS Amazon and Flipkart product URLs are supported.');
    }
    return parsed;
}

function setCors(req, res) {
    const origin = req.headers.origin;
    let isVercelPreview = false;
    try {
        isVercelPreview = /\.vercel\.app$/i.test(new URL(origin).hostname);
    } catch {
        isVercelPreview = false;
    }
    if (ALLOWED_ORIGINS.has(origin) || isVercelPreview) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Vary', 'Origin');
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

async function fetchProductPage(startUrl) {
    let currentUrl = parseAllowedProductUrl(startUrl);

    for (let redirectCount = 0; redirectCount < 4; redirectCount++) {
        const response = await fetch(currentUrl, {
            redirect: 'manual',
            signal: AbortSignal.timeout(15000),
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36',
                'accept': 'text/html,application/xhtml+xml',
                'accept-language': 'en-IN,en;q=0.9',
                'cache-control': 'no-cache'
            }
        });

        if (response.status >= 300 && response.status < 400) {
            const location = response.headers.get('location');
            if (!location) throw new Error('The store returned an invalid redirect.');
            currentUrl = parseAllowedProductUrl(new URL(location, currentUrl).href);
            continue;
        }
        if (!response.ok) {
            throw new Error(`Amazon blocked the server request (HTTP ${response.status}).`);
        }

        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('text/html')) {
            throw new Error('The URL did not return a product webpage.');
        }
        const contentLength = Number(response.headers.get('content-length')) || 0;
        if (contentLength > MAX_PRODUCT_PAGE_BYTES) {
            throw new Error('The product page is too large to process safely.');
        }

        const html = await response.text();
        if (Buffer.byteLength(html, 'utf8') > MAX_PRODUCT_PAGE_BYTES) {
            throw new Error('The product page is too large to process safely.');
        }
        if (html.length < 500) {
            throw new Error('Amazon returned an empty response.');
        }
        if (/robot check|validateCaptcha|enter the characters you see below|api-services-support@amazon/i.test(html)) {
            throw new Error('Amazon requested a CAPTCHA from the server. Open the product normally and paste its copied details instead.');
        }
        return { html, finalUrl: currentUrl.href };
    }

    throw new Error('The product URL redirected too many times.');
}

module.exports = async function handler(req, res) {
    setCors(req, res);
    res.setHeader('Cache-Control', 'no-store');
    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST for product fetching.' });

    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
        const result = await fetchProductPage(body.url);
        return res.status(200).json(result);
    } catch (error) {
        const message = error && error.name === 'TimeoutError'
            ? 'Amazon took too long to respond.'
            : (error.message || 'Could not fetch the product page.');
        return res.status(422).json({ error: message });
    }
};

module.exports.fetchProductPage = fetchProductPage;
module.exports.parseAllowedProductUrl = parseAllowedProductUrl;
