// Minimal required by Manifest V3 – stays idle
chrome.runtime.onInstalled.addListener(() => {
  console.log('BuildMart Amazon Importer installed');
});