/**
 * PAPER ROUTER SYSTEM
 * 
 * Client-side single page app hash routing.
 */

let routes = {};
let routerContainer = null;

/**
 * Map a new hash SPA routing path to a component builder callback.
 * 
 * @param {string} path Anchor hash path (e.g. '/' or '/about')
 * @param {function} componentFn Callback rendering path components
 */
paper.route = (path, componentFn) => {
    routes[path] = componentFn;
};

/**
 * Initialize and mount the hash router container. Updates routing states on hashchanges.
 * 
 * @returns {HTMLDivElement} Dynamic router mount element
 */
paper.router = () => {
    routerContainer = paper.div({ style: { display: 'contents' } });
    let navigate = () => {
        let path = window.location.hash.slice(1) || '/';
        let routeFn = routes[path] || routes['*'] || (() => paper.div("404 - Not Found"));
        routerContainer.innerHTML = '';
        routerContainer.appendChild(routeFn());
    };
    window.addEventListener('hashchange', navigate);
    setTimeout(navigate, 0);
    return routerContainer;
};

/**
 * Navigate programmatically to any registered hash SPA route.
 * 
 * @param {string} path Routing target hash path
 */
paper.navigate = (path) => {
    window.location.hash = path;
};
