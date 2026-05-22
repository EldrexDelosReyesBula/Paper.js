/**
 * PAPER UI COMPONENTS
 * Cinematic, interactive UI elements (Toasts, Modals, Sheets).
 */
(function() {
    // 1. Toast System
    let toastContainer = null;
    papyr.toast = (message, type = 'default') => {
        if (typeof window === 'undefined') return;
        
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.style.position = 'fixed';
            toastContainer.style.bottom = '20px';
            toastContainer.style.right = '20px';
            toastContainer.style.display = 'flex';
            toastContainer.style.flexDirection = 'column';
            toastContainer.style.gap = '10px';
            toastContainer.style.zIndex = '9999';
            document.body.appendChild(toastContainer);
        }

        let bg = type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6';
        let toastEl = document.createElement('div');
        toastEl.innerText = message;
        toastEl.style.background = bg;
        toastEl.style.color = '#fff';
        toastEl.style.padding = '12px 24px';
        toastEl.style.borderRadius = '8px';
        toastEl.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
        toastEl.style.fontFamily = 'inherit';
        toastEl.style.fontSize = '14px';
        
        // CSS Transition for entrance
        toastEl.style.opacity = '0';
        toastEl.style.transform = 'translateY(20px)';
        toastEl.style.transition = 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)';
        
        toastContainer.appendChild(toastEl);

        // Trigger entrance animation
        requestAnimationFrame(() => {
            toastEl.style.opacity = '1';
            toastEl.style.transform = 'translateY(0)';
        });

        // Auto remove
        setTimeout(() => {
            toastEl.style.opacity = '0';
            toastEl.style.transform = 'translateY(10px)';
            setTimeout(() => toastEl.remove(), 300);
        }, 3000);
    };

    // 2. Modal System
    papyr.modal = (options = {}) => {
        const { title = '', content = '', animation = 'glass-pop', onClose } = options;
        
        let overlay = papyr.div({
            style: {
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                zIndex: 9998, opacity: 0, transition: 'opacity 0.3s'
            },
            onclick: (e) => {
                if (e.target === overlay) close();
            }
        });

        let modalBox = papyr.glass({
            style: {
                padding: '24px', width: '90%', maxWidth: '400px',
                transform: animation === 'glass-pop' ? 'scale(0.8)' : 'translateY(50px)',
                transition: 'transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)'
            }
        }, 
            papyr.flex.between(
                papyr.h3(title, { style: { margin: 0, color: '#fff' } }),
                papyr.button("×", { 
                    onclick: () => close(),
                    style: { background: 'transparent', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer' }
                })
            ),
            papyr.div({ style: { marginTop: '15px', color: 'var(--text-muted)' } }, content)
        );

        overlay.appendChild(modalBox);
        document.body.appendChild(overlay);

        // Animate In
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            modalBox.style.transform = animation === 'glass-pop' ? 'scale(1)' : 'translateY(0)';
        });

        const close = () => {
            overlay.style.opacity = '0';
            modalBox.style.transform = animation === 'glass-pop' ? 'scale(0.8)' : 'translateY(50px)';
            setTimeout(() => {
                overlay.remove();
                if (onClose) onClose();
            }, 300);
        };

        return { close };
    };

    // 3. Mobile Bottom Sheet
    papyr.sheet = (options = {}) => {
        const { content = '' } = options;
        // Re-use modal overlay logic but with bottom-anchored sliding physics
        let overlay = papyr.div({
            style: {
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                background: 'rgba(0,0,0,0.5)', zIndex: 9998, opacity: 0, transition: 'opacity 0.3s'
            },
            onclick: (e) => { if (e.target === overlay) close(); }
        });

        let sheetBox = papyr.div({
            style: {
                position: 'absolute', bottom: 0, left: 0, width: '100%',
                background: '#1e293b', borderTopLeftRadius: '24px', borderTopRightRadius: '24px',
                padding: '24px', transform: 'translateY(100%)',
                transition: 'transform 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)'
            }
        },
            // Drag Handle
            papyr.div({ style: { width: '40px', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px', margin: '0 auto 20px auto' } }),
            content
        );

        overlay.appendChild(sheetBox);
        document.body.appendChild(overlay);

        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            sheetBox.style.transform = 'translateY(0)';
        });

        const close = () => {
            overlay.style.opacity = '0';
            sheetBox.style.transform = 'translateY(100%)';
            setTimeout(() => overlay.remove(), 300);
        };
    };
})();
