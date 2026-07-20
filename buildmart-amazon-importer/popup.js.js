// popup.js
let extractedData = null;
let currentTab = null;

document.addEventListener('DOMContentLoaded', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  currentTab = tab;
  displayTabInfo(tab);
  document.getElementById('scanBtn').addEventListener('click', () => scanPage(tab));
  document.getElementById('importBtn').addEventListener('click', () => startImport());
  document.getElementById('copyBtn').addEventListener('click', () => copyJSON());
  document.getElementById('optionsBtn').addEventListener('click', () => chrome.runtime.openOptionsPage());
});

function displayTabInfo(tab) {
  document.getElementById('url').textContent = tab.url;
  const supported = tab.url && (tab.url.includes('amazon.in') || tab.url.includes('amzn.in'));
  if (!supported) {
    setStatus('This is not a supported Amazon India product page.', 'error');
    document.getElementById('scanBtn').disabled = true;
    return;
  }
  document.getElementById('scanBtn').disabled = false;
}

async function scanPage(tab) {
  setStatus('Reading product and loading its variations…', 'info');
  try {
    const response = await chrome.tabs.sendMessage(tab.id, { action: 'EXTRACT' });
    if (!response.success) throw new Error(response.error);
    extractedData = response.data;
    populatePreview(extractedData);
    document.getElementById('importBtn').disabled = false;
    setStatus('Extraction complete. Review data below.', 'success');
  } catch (err) {
    setStatus('Extraction failed: ' + err.message, 'error');
  }
}

function populatePreview(data) {
  document.getElementById('asin').textContent = data.source?.asin || '—';
  document.getElementById('title').textContent = data.product?.name || '—';
  document.getElementById('title').title = data.product?.name || '';
  document.getElementById('price').textContent = data.product?.price ? '₹' + data.product.price : '—';
  document.getElementById('images').textContent = data.product?.images?.length || 0;
  document.getElementById('specs').textContent = data.product?.specifications?.length || 0;
  document.getElementById('variants').textContent = data.variants?.length || 0;
  if (data.warnings?.length) {
    document.getElementById('warnings').innerHTML = data.warnings.map(w => '⚠️ ' + w).join('<br>');
  }
}

async function startImport() {
  if (!extractedData) return;
  const { buildmart_url } = await chrome.storage.sync.get('buildmart_url');
  const targetUrl = buildmart_url || 'file:///C:/Users/kasha/OneDrive/Desktop/collection/add-product.html';
  const importId = extractedData.import_id;

  await chrome.storage.local.set({ [importId]: extractedData });

  const finalUrl = targetUrl + (targetUrl.includes('?') ? '&' : '?') + 'amazonExtensionImport=' + importId;
  await chrome.tabs.create({ url: finalUrl });
}

function copyJSON() {
  if (!extractedData) return;
  navigator.clipboard.writeText(JSON.stringify(extractedData, null, 2))
    .then(() => setStatus('JSON copied to clipboard', 'success'))
    .catch(() => setStatus('Failed to copy', 'error'));
}

function setStatus(msg, type) {
  const el = document.getElementById('status');
  el.textContent = msg;
  el.className = 'status ' + (type || 'info');
}
