// PAPER FORM PLUGIN
// Custom forms plugin that adds inputs and forms shortcuts to paper

function formPlugin(paper) {
    papyr.input = (type, placeholder, options = {}) => {
        return papyr('input', `.input-${type}`, {
            type: type, 
            placeholder: placeholder, 
            ...options
        });
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
