(function () {
    const source = document.createElement('script');
    source.src = 'public/firebase-auth-core.js?v=2026.07.20.FIREBASE1';
    source.onerror = () => console.error('Could not load Firebase owner authentication.');
    document.head.appendChild(source);
})();
