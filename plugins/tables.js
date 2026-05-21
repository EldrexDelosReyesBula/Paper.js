// PAPER TABLES PLUGIN
// Custom plugin for simple automated data grids and tables

function tablePlugin(paper) {
    paper.simpleTable = (data) => {
        let table = paper('table', '.paper-table');
        
        // Add headers
        if (data.headers) {
            let thead = paper('thead');
            let tr = paper('tr');
            data.headers.forEach(header => {
                tr.appendChild(paper('th', header));
            });
            thead.appendChild(tr);
            table.appendChild(thead);
        }
        
        // Add rows
        if (data.rows) {
            let tbody = paper('tbody');
            data.rows.forEach(row => {
                let tr = paper('tr');
                row.forEach(cell => {
                    tr.appendChild(paper('td', String(cell)));
                });
                tbody.appendChild(tr);
            });
            table.appendChild(tbody);
        }
        
        return table;
    };
}

// Export for ES modules and window fallback
if (typeof module !== 'undefined' && module.exports) {
    module.exports = tablePlugin;
} else if (typeof window !== 'undefined') {
    window.tablePlugin = tablePlugin;
}
