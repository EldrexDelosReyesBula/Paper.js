/**
 * PAPER LAYOUT ENGINE
 * Structural layout orchestration and zero-conflict responsive workspace management.
 */
(function() {
    papyr.layout = {
        /**
         * Responsive Flex Container
         * Automatically adjusts based on screen width CSS variables.
         */
        flex(options = {}, ...children) {
            let config = Object.assign({
                direction: 'var(--papyr-flex-dir, row)',
                wrap: 'var(--papyr-flex-wrap, wrap)',
                justify: 'var(--papyr-flex-justify, flex-start)',
                align: 'var(--papyr-flex-align, stretch)',
                gap: 'var(--papyr-flex-gap, 16px)'
            }, options);

            return papyr.div({
                class: 'papyr-layout-flex',
                style: {
                    display: 'flex',
                    flexDirection: config.direction,
                    flexWrap: config.wrap,
                    justifyContent: config.justify,
                    alignItems: config.align,
                    gap: config.gap,
                    width: '100%'
                }
            }, ...children);
        },

        /**
         * Advanced CSS Grid Container
         */
        grid(options = {}, ...children) {
            let config = Object.assign({
                cols: 'var(--papyr-grid-cols, repeat(auto-fit, minmax(250px, 1fr)))',
                rows: 'var(--papyr-grid-rows, auto)',
                gap: 'var(--papyr-grid-gap, 20px)'
            }, options);

            return papyr.div({
                class: 'papyr-layout-grid',
                style: {
                    display: 'grid',
                    gridTemplateColumns: config.cols,
                    gridTemplateRows: config.rows,
                    gap: config.gap,
                    width: '100%'
                }
            }, ...children);
        },

        /**
         * Semantic Semantic Wrappers
         */
        row(...children) { return this.flex({ direction: 'row' }, ...children); },
        col(...children) { return this.flex({ direction: 'column' }, ...children); },

        /**
         * Persistent App Shell / Dashboard Template
         */
        dashboard(options = {}) {
            const { 
                sidebar = null, 
                header = null, 
                main = null, 
                footer = null 
            } = options;

            // Using semantic tags with dedicated layout classes for router parsing
            let shell = papyr.div({
                class: 'papyr-app-shell',
                style: {
                    display: 'grid',
                    gridTemplateColumns: sidebar ? 'var(--papyr-sidebar-width, 250px) 1fr' : '1fr',
                    gridTemplateRows: header ? 'var(--papyr-header-height, 60px) 1fr auto' : '1fr auto',
                    minHeight: '100vh',
                    width: '100%'
                }
            });

            // Media Query CSS logic injected if needed, but handled by inline overrides via media queries
            if (header) {
                shell.appendChild(papyr.el('header', { 
                    class: 'papyr-shell-header',
                    style: { gridColumn: sidebar ? '1 / -1' : '1', background: 'var(--papyr-surface, #ffffff)', borderBottom: '1px solid var(--papyr-border, #e2e8f0)' }
                }, header));
            }

            if (sidebar) {
                shell.appendChild(papyr.el('aside', {
                    class: 'papyr-shell-sidebar',
                    style: { gridRow: header ? '2 / -1' : '1 / -1', background: 'var(--papyr-surface, #f8fafc)', borderRight: '1px solid var(--papyr-border, #e2e8f0)', overflowY: 'auto' }
                }, sidebar));
            }

            // This is the golden persistent marker: <main class="papyr-main-content">
            // The router will target this instead of #app.
            shell.appendChild(papyr.el('main', {
                class: 'papyr-main-content',
                style: { padding: 'var(--papyr-main-padding, 24px)', overflowY: 'auto' }
            }, main || papyr.div("Main Content Area")));

            if (footer) {
                shell.appendChild(papyr.el('footer', {
                    class: 'papyr-shell-footer',
                    style: { gridColumn: sidebar ? '2 / -1' : '1', background: 'var(--papyr-surface, #ffffff)', borderTop: '1px solid var(--papyr-border, #e2e8f0)' }
                }, footer));
            }

            return shell;
        }
    };
})();
