/**
 * PAPER PWA ENGINE
 * One-line registration for Progressive Web App Service Workers.
 */
(function() {
    papyr.pwa = {
        async init(swPath = '/sw.js') {
            if ('serviceWorker' in navigator) {
                try {
                    const registration = await navigator.serviceWorker.register(swPath);
                    papyr.log('PWA ServiceWorker Registration successful with scope: ', registration.scope);
                } catch (err) {
                    papyr.warn('PWA ServiceWorker registration failed: ', err);
                }
            } else {
                papyr.warn('PWA ServiceWorkers are not supported in this browser.');
            }
        }
    };
})();
