const defaultUrl = 'file:///C:/Users/kasha/OneDrive/Desktop/collection/add-product.html';
const onlineUrl = 'https://gajjarkashyap.github.io/BUILD-MART-FINAL-REPO/add-product.html';

document.addEventListener('DOMContentLoaded', async () => {
  const { buildmart_url } = await chrome.storage.sync.get('buildmart_url');
  document.getElementById('urlInput').value = buildmart_url || defaultUrl;

  document.getElementById('presetLocal').addEventListener('click', () => {
    document.getElementById('urlInput').value = defaultUrl;
  });
  document.getElementById('presetOnline').addEventListener('click', () => {
    document.getElementById('urlInput').value = onlineUrl;
  });
  document.getElementById('saveBtn').addEventListener('click', saveOptions);
});

async function saveOptions() {
  const url = document.getElementById('urlInput').value.trim();
  if (!url) return showStatus('URL cannot be empty', 'error');
  await chrome.storage.sync.set({ buildmart_url: url });
  showStatus('Settings saved.', 'success');
}

function showStatus(msg, type) {
  const el = document.getElementById('status');
  el.textContent = msg;
  el.style.color = type === 'error' ? 'red' : 'green';
}