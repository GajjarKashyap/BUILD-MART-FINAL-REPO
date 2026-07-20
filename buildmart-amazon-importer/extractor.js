// Local product extraction from Amazon India.

/**
 * Main entry point. Returns a full import object.
 */
function extractProductData() {
  const warnings = [];
  const extracted = {
    schema: "buildmart.amazon-import.v1",
    import_id: generateUUID(),
    created_at: new Date().toISOString(),
    source: {},
    product: {
      name: null,
      brand: null,
      model: null,
      category_hint: "",
      subcategory_hint: "",
      price: null,
      mrp: null,
      currency: "INR",
      features: [],
      description: "",
      specifications: [],
      images: []
    },
    variants: [],
    mixed_box: null,
    confidence: {},
    warnings: [],
    raw: {}
  };

  try {
    if (/robot check|validatecaptcha|enter the characters you see below/i.test(document.body?.innerText || '')) {
      extracted.warnings.push('Amazon is showing a CAPTCHA. Complete it and scan again.');
      return extracted;
    }
    // 1. Try JSON-LD
    const ld = tryJSONLD();
    if (ld) {
      mergeJSONLD(ld, extracted);
    }

    // 2. DOM fallbacks – always run to fill gaps
    extractFromDOM(extracted);

    // 3. Variant extraction (twister)
    extractVariants(extracted);

    // 4. Mixed box detection
    detectMixedBox(extracted);

    // 5. Normalise and fill missing confidence
    normaliseExtracted(extracted);
    assessConfidence(extracted);

    return extracted;
  } catch (err) {
    warnings.push('Extraction error: ' + err.message);
    extracted.warnings.push(...warnings);
    return extracted;
  }
}

/* ---------- JSON‑LD ---------- */
function tryJSONLD() {
  const scripts = document.querySelectorAll('script[type="application/ld+json"]');
  for (const script of scripts) {
    try {
      const data = JSON.parse(script.textContent);
      if (data['@type'] === 'Product' || (Array.isArray(data['@graph']) && data['@graph'].some(e => e['@type'] === 'Product'))) {
        return data;
      }
    } catch (e) { /* skip */ }
  }
  return null;
}

function mergeJSONLD(ld, target) {
  const product = Array.isArray(ld['@graph']) ? ld['@graph'].find(p => p['@type'] === 'Product') : ld;
  if (!product) return;
  target.source.asin = product.sku || '';
  target.product.name = product.name || '';
  target.product.brand = product.brand?.name || product.brand || '';
  target.product.description = product.description || '';
  if (product.offers) {
    const offer = Array.isArray(product.offers) ? product.offers[0] : product.offers;
    target.product.price = parseFloat(offer.price) || null;
    target.product.mrp = parseFloat(offer.priceValidUntil) ? null : parseFloat(offer.price); // rough
    target.product.currency = offer.priceCurrency || 'INR';
  }
  if (product.image) {
    const imgs = Array.isArray(product.image) ? product.image : [product.image];
    target.product.images = imgs.map(u => u.url || u).filter(Boolean);
  }
  target.product.features = product.description ? [product.description] : [];
}

/* ---------- DOM fallbacks ---------- */
function extractFromDOM(ext) {
  // ASIN
  const asinInput = document.querySelector('#ASIN, input[name="ASIN"]');
  ext.source.asin = (asinInput ? asinInput.value : '') ||
    (window.location.pathname.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i) || [])[1] || ext.source.asin || '';
  ext.source.url = window.location.href;
  ext.source.canonical_url = document.querySelector('link[rel="canonical"]')?.href || window.location.href;

  // Title
  const titleEl = document.querySelector('#productTitle');
  ext.product.name = cleanText(titleEl?.textContent) || ext.product.name;

  // Price
  const salePrice = document.querySelector('#priceblock_ourprice, #priceblock_dealprice, .a-price .a-offscreen');
  const mrpEl = document.querySelector('#listPrice, .a-price.a-text-price .a-offscreen');
  ext.product.price = parsePrice(salePrice?.textContent) ?? ext.product.price;
  ext.product.mrp = parsePrice(mrpEl?.textContent) ?? ext.product.mrp;
  ext.product.currency = 'INR';

  // Brand
  const brandEl = document.querySelector('#bylineInfo');
  ext.product.brand = cleanText(brandEl?.textContent) || ext.product.brand;

  // Features
  const featureBullets = document.querySelectorAll('#feature-bullets .a-list-item');
  ext.product.features = Array.from(featureBullets).map(el => cleanText(el.textContent)).filter(Boolean);

  // Description
  const descEl = document.querySelector('#productDescription');
  ext.product.description = cleanText(descEl?.textContent) || ext.product.description;

  // Specifications
  const specsTables = document.querySelectorAll('#productDetails_techSpec_section_1, #productDetails_detailBullets_sections1, #prodDetails table, #technicalSpecifications_feature_div table, #detailBullets_feature_div');
  specsTables.forEach(specsTable => {
    const rows = specsTable.querySelectorAll('tr');
    rows.forEach(row => {
      const key = cleanText(row.querySelector('th')?.textContent);
      const value = cleanText(row.querySelector('td')?.textContent);
      if (key && value) ext.product.specifications.push({ key, value });
    });
  });

  // Images
  const mainImg = document.querySelector('#landingImage');
  const mainUrl = mainImg?.src || mainImg?.dataset.oldHires || '';
  const galleryImgs = document.querySelectorAll('#altImages img');
  const imgUrls = new Set();
  if (mainUrl) imgUrls.add(highResUrl(mainUrl));
  galleryImgs.forEach(img => {
    let src = img.src || img.dataset.src;
    if (src) imgUrls.add(highResUrl(src));
  });
  ext.product.images = Array.from(imgUrls).filter(u => !u.includes('pixel') && !u.includes('video'));
}

function cleanText(str) {
  return (str || '').replace(/\s+/g, ' ').trim();
}

function parsePrice(text) {
  if (!text) return null;
  const num = text.replace(/[₹,\s]/g, '');
  const val = parseFloat(num);
  return isNaN(val) ? null : val;
}

function highResUrl(url) {
  if (typeof url !== 'string' || !url) return '';
  return url.replace(/\._[A-Z0-9]+_\./, '.').replace(/\?.*$/, '');
}

/* ---------- Variants ---------- */
function extractVariants(ext) {
  const variantDims = [];
  const swatchLists = document.querySelectorAll('ul[class*="swatch"]');

  swatchLists.forEach(ul => {
    const dimension = ul.closest('[id*="variation_"]')?.id?.replace('variation_','') || 'unknown';
    const items = ul.querySelectorAll('li[data-defaultasin], li[data-asin]');
    items.forEach(li => {
      const asin = li.dataset.defaultasin || li.dataset.asin;
      const value = li.querySelector('.swatch-title-text')?.textContent?.trim() || li.title || '';
      const img = li.querySelector('img')?.src;
      const selected = li.classList.contains('selected');
      variantDims.push({ dimension, value, asin, selected, image: highResUrl(img) || null });
    });
  });

  if (variantDims.length === 0) return;

  // Group by dimension
  const grouped = {};
  variantDims.forEach(v => {
    if (!grouped[v.dimension]) grouped[v.dimension] = [];
    grouped[v.dimension].push(v);
  });

  // Create product variants (Cartesian product of dimensions)
  const dimNames = Object.keys(grouped);
  const variants = cartesianProduct(...dimNames.map(d => grouped[d])).map(combo => {
    const variant = {};
    combo.forEach(v => {
      variant[v.dimension] = v.value;
    });
    variant.asin = combo[0].asin;
    variant.price = combo.some(v => v.selected) ? ext.product.price : null;
    variant.image = combo.find(v => v.image)?.image || null;
    variant.selected = combo.some(v => v.selected);
    return variant;
  });

  ext.variants = variants;
}

function cartesianProduct(...arrays) {
  return arrays.reduce((acc, curr) => {
    const res = [];
    acc.forEach(a => {
      curr.forEach(b => {
        res.push(a.concat([b]));
      });
    });
    return res;
  }, [[]]);
}

/* ---------- Mixed Box ---------- */
function detectMixedBox(ext) {
  const text = (ext.product.name + ' ' + ext.product.description + ' ' + ext.product.features.join(' ')).toLowerCase();
  const sizePattern = /(\d+(?:\.\d+)?)\s*(mm|cm|inch|inches|m|meter|kg|g|gm|lbs|oz)/g;
  const sizes = [...text.matchAll(sizePattern)].map(m => ({ size: parseFloat(m[1]), unit: m[2] }));
  if ((text.includes('assorted') || text.includes('mixed') || text.includes('combo')) && sizes.length > 1) {
    ext.mixed_box = {
      sale_mode: 'mixed_box',
      total_quantity: parseInt((text.match(/(\d+)\s*(?:pieces|pcs|total)/) || [])[1]) || null,
      components: sizes.map(s => ({ size: s.size, unit: s.unit, quantity: null })),
      price: ext.product.price
    };
  }
}

/* ---------- Normalisation ---------- */
function normaliseExtracted(ext) {
  ext.product.images = [...new Set(ext.product.images)];
  ext.product.specifications = ext.product.specifications.filter(s => s.key && s.value);
}

function assessConfidence(ext) {
  ext.confidence = {
    name: ext.product.name ? 0.95 : 0,
    price: ext.product.price ? 0.9 : 0,
    images: ext.product.images.length > 0 ? 0.95 : 0,
    variants: ext.variants.length > 0 ? 0.7 : 0
  };
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}
