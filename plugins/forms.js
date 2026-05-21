// PAPER FORM PLUGIN
// Custom forms plugin that adds inputs and forms shortcuts to paper

function formPlugin(paper) {
    paper.input = (type, placeholder, options = {}) => {
        return paper('input', `.input-${type}`, {
            type: type, 
            placeholder: placeholder, 
            ...options
        });
    };
    
    paper.form = (...fields) => {
        let form = paper('form', '.form');
        fields.forEach(f => {
            if (f.text && f.placeholder) {
                form.appendChild(paper.input(f.text, f.placeholder));
            } else if (f instanceof HTMLElement) {
                form.appendChild(f);
            }
        });
        form.appendChild(paper('button', 'Submit', { type: 'submit' }));
        return form;
    };
}

// Export for ES modules and window fallback
if (typeof module !== 'undefined' && module.exports) {
    module.exports = formPlugin;
} else if (typeof window !== 'undefined') {
    window.formPlugin = formPlugin;
}
