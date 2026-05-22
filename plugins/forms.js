// PAPYR FORM PLUGIN
// Custom forms plugin that adds inputs and forms shortcuts to Papyr

function formPlugin(paper) {
    papyr.input = (type, placeholder, options = {}) => {
        if (typeof type === 'object' && type !== null) return papyr('input', type);
        if (typeof placeholder === 'object' && placeholder !== null) { options = placeholder; placeholder = options.placeholder || ''; }
        options = Object.assign({}, options);
        if (type) options.type = options.type || type;
        if (placeholder) options.placeholder = options.placeholder || placeholder;
        if (type) return papyr('input', `.input-${type}`, options);
        return papyr('input', options);
    };
    
    papyr.form = (...fields) => {
        let form = papyr('form', '.form');
        fields.forEach(f => {
            if (f.text && f.placeholder) {
                form.appendChild(papyr.input(f.text, f.placeholder));
            } else if (f instanceof HTMLElement) {
                form.appendChild(f);
            }
        });
        form.appendChild(papyr('button', 'Submit', { type: 'submit' }));
        return form;
    };
}

// Export for ES modules and window fallback
if (typeof module !== 'undefined' && module.exports) {
    module.exports = formPlugin;
} else if (typeof window !== 'undefined') {
    window.formPlugin = formPlugin;
}
