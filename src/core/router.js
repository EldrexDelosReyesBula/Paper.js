/**
 * PAPER ROUTER
 * Clean URL HTML5 History API Router.
 */
(function() {
    let routes = [];
    let currentView = paper.state(null);
    let routerContainer = null;
    let pathParams = paper.state({});

    /**
     * Define a route.
     * @param {string} path Route path (e.g., "/about", "/user/:id")
     * @param {function} componentFn Component to render
     */
    paper.route = (path, componentFn) => {
        routes.push({
            path,
            regex: new RegExp('^' + path.replace(/:\w+/g, '([^/]+)') + '$'),
            keys: (path.match(/:\w+/g) || []).map(k => k.slice(1)),
            componentFn
        });
    };

    /**
     * Navigates to a specific path using HTML5 pushState.
     * @param {string} path Target URL path
     */
    paper.navigate = (path) => {
        if (typeof window !== 'undefined') {
            window.history.pushState({}, '', path);
            window.dispatchEvent(new Event('popstate'));
        }
    };

    /**
     * Intercept clicks on local links to route via pushState instead of full reload.
     */
    if (typeof document !== 'undefined') {
        document.addEventListener('click', e => {
            let a = e.target.closest('a');
            if (a && a.href && a.href.startsWith(window.location.origin)) {
                // If it's a local link and not a hash link
                let path = a.getAttribute('href');
                if (path && !path.startsWith('#') && !a.hasAttribute('data-no-route')) {
                    e.preventDefault();
                    paper.navigate(path);
                }
            }
        });

        window.addEventListener('popstate', () => {
            let currentPath = window.location.pathname;
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
            window.dispatchEvent(new Event('popstate')); // Initial load
        }
        
        // Reactive component switcher
        return paper.if(
            currentView,
            () => currentView.value(),
            () => paper.div()
        );
    };

})();
