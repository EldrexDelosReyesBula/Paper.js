/**
 * PAPER ANIMATE
 * Zero-dependency hardware-accelerated animation engine.
 */
(function() {
    // Styles are bundled natively via build.js into paper-complete-styles

    const prefersReducedMotion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
    
    // Intersection Observer for scroll animations
    let observer = null;
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
        observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    let anim = entry.target.dataset.animate;
                    if (anim) {
                        entry.target.classList.add(`animate-${anim}`);
                        entry.target.classList.add('animated');
                    }
                    if (entry.target.dataset.animateOnce !== 'false') {
                        observer.unobserve(entry.target);
                    }
                } else if (entry.target.dataset.animateOnce === 'false') {
                    // Reverse animation if scrolling out of view
                    let anim = entry.target.dataset.animate;
                    if (anim) {
                        entry.target.classList.remove(`animate-${anim}`);
                        entry.target.classList.remove('animated');
                    }
                }
            });
        }, { threshold: 0.1 });
    }

    // Override paper-core.js to intercept 'animate' attribute
    const originalPaper = window.paper;
    if (originalPaper) {
        // We will monkey-patch the original paper function or use a plugin hook
        // Since paper is a function, we can wrap it, or we can use a MutationObserver to catch new elements with animate attr.
        // Actually, the easiest way is to add a hook in paper-core.js. 
        // But to keep it self-contained, we can observe the DOM for [data-animate] or [animate].
        // Alternatively, since paper-core sets properties, we can just intercept `el.setAttribute('animate', val)`.
        
        let mo = new MutationObserver(mutations => {
            if (prefersReducedMotion) return;
            mutations.forEach(m => {
                m.addedNodes.forEach(node => {
                    if (node instanceof Element) {
                        let elements = [node, ...node.querySelectorAll('[animate]')];
                        elements.forEach(el => {
                            if (el.hasAttribute('animate') && observer) {
                                let animType = el.getAttribute('animate');
                                el.dataset.animate = animType;
                                el.removeAttribute('animate'); // Clean DOM
                                el.classList.add('paper-animate-base');
                                observer.observe(el);
                            }
                        });
                    }
                });
            });
        });
        
        if (typeof document !== 'undefined') {
            mo.observe(document.body || document.documentElement, { childList: true, subtree: true });
        }
    }
})();
