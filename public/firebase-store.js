(function () {
    'use strict';

    const source = document.createElement('script');
    source.src = 'firebase-store-core.js?v=2026.07.20.FIREBASE1';
    source.onerror = () => console.error('Could not load the BuildMart Firebase adapter.');
    document.head.appendChild(source);
})();
