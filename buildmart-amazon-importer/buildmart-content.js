// BuildMart temporary-import bridge.
(function() {
  const urlParams = new URLSearchParams(window.location.search);
  const importId = urlParams.get('amazonExtensionImport');
  if (!importId || !/^[a-f0-9-]{20,50}$/i.test(importId)) return;

  chrome.storage.local.get(importId, (result) => {
    const payload = result[importId];
    if (!payload) {
      console.error('Import payload not found for ID:', importId);
      return;
    }
    const createdAt = Date.parse(payload.created_at || '');
    if (!createdAt || Date.now() - createdAt > 30 * 60 * 1000) {
      chrome.storage.local.remove(importId);
      console.error('Import payload expired:', importId);
      return;
    }
    const deliver = () => window.postMessage({
        source: 'buildmart-amazon-extension',
        action: 'importData',
        payload
    }, '*');
    const retry = setInterval(deliver, 500);
    deliver();
    const accept = event => {
      if (event.source !== window || event.data?.source !== 'buildmart-page' ||
          event.data?.action !== 'importAccepted' || event.data?.import_id !== importId) return;
      clearInterval(retry);
      window.removeEventListener('message', accept);
      chrome.storage.local.remove(importId);
    };
    window.addEventListener('message', accept);
    setTimeout(() => clearInterval(retry), 10000);
  });
})();
