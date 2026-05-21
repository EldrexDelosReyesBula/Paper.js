/**
 * PAPER ROUTER
 * Zero-configuration Hash SPA Router.
 */
(function() {
    let routes = [];
    let currentView = paper.state(null);
    let pathParams = paper.state({});

    /**
     * Define a hash route.
     * @param {string} path Route path (e.g., "#/about", "#/user/:id")
     * @param {function|class} componentFn Component or Class to render
     */
    paper.route = (path, componentFn) => {
        // Strip leading hash for internal regex matching
        let cleanPath = path.startsWith('#') ? path.substring(1) : path;
        routes.push({
            path: cleanPath,
            regex: new RegExp('^' + cleanPath.replace(/:\w+/g, '([^/]+)') + '$'),
            keys: (cleanPath.match(/:\w+/g) || []).map(k => k.slice(1)),
            componentFn
        });
    };

    /**
     * Navigates to a specific path using hash.
     * @param {string} path Target URL hash path
     */
    paper.navigate = (path) => {
        if (typeof window !== 'undefined') {
            window.location.hash = path.startsWith('#') ? path : '#' + path;
        }
    };

    if (typeof window !== 'undefined') {
        window.addEventListener('hashchange', () => {
            let currentPath = window.location.hash.slice(1) || '/';
            let matchFound = false;

            for (let route of routes) {
                let match = currentPath.match(route.regex);
                if (match) {
                    let params = {};
                    route.keys.forEach((key, index) => {
                        params[key] = match[index + 1];
                    });
                    pathParams.value = params;
                    currentView.value = route.componentFn;
                    matchFound = true;
                    break;
                }
            }
            if (!matchFound) {
                currentView.value = () => paper.div("404 - Route Not Found");
            }
        });
    }

    /**
     * Global accessor for route parameters
     */
    paper.useParams = () => pathParams;

    /**
     * Initializes the router and returns the reactive router container.
     */
    paper.router = () => {
        if (typeof window !== 'undefined' && routes.length > 0 && !currentView.value) {
            window.dispatchEvent(new Event('hashchange')); // Initial load
        }
        
        // Reactive component switcher
        return paper.if(
            currentView,
            () => {
                let Component = currentView.value;
                // OOP Check: if it's a class extending paper.component
                if (Component.prototype && Component.prototype instanceof paper.component) {
                    return new Component().render();
                }
                return Component();
            },
            () => paper.div()
        );
    };

})();
