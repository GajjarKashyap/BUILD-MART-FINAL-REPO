const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const MAX_PRODUCT_PAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_PRODUCT_HOSTS = [
    'amazon.in',
    'amazon.com',
    'amzn.in',
    'flipkart.com'
];

app.use(cors());
app.use(express.json({ limit: '64kb' }));
app.use(express.static(path.join(__dirname, 'public')));

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

async function fetchProductPage(startUrl) {
    let currentUrl = parseAllowedProductUrl(startUrl);

    for (let redirectCount = 0; redirectCount < 4; redirectCount++) {
        const response = await fetch(currentUrl, {
            redirect: 'manual',
            signal: AbortSignal.timeout(15000),
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36',
                'accept': 'text/html,application/xhtml+xml',
                'accept-language': 'en-IN,en;q=0.9'
            }
        });

        if (response.status >= 300 && response.status < 400) {
            const location = response.headers.get('location');
            if (!location) throw new Error('The store returned an invalid redirect.');
            currentUrl = parseAllowedProductUrl(new URL(location, currentUrl).href);
            continue;
        }

        if (!response.ok) {
            throw new Error(`The store returned HTTP ${response.status}.`);
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
            throw new Error('The store returned an empty or blocked page.');
        }

        return { html, finalUrl: currentUrl.href };
    }

    throw new Error('The product URL redirected too many times.');
}

app.post('/api/product-page', async (req, res) => {
    try {
        const result = await fetchProductPage(req.body && req.body.url);
        res.json(result);
    } catch (error) {
        const message = error && error.name === 'TimeoutError'
            ? 'The store took too long to respond.'
            : (error.message || 'Could not fetch the product page.');
        res.status(422).json({ error: message });
    }
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
        console.log(`The app is now using BROWSER STORAGE. Data is saved in your browser.`);
    });
}

module.exports = { app, parseAllowedProductUrl };
