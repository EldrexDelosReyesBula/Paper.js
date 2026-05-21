const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '..', 'app.js');
let content = fs.readFileSync(appPath, 'utf8');

// The showcases code to inject
const showcasesCode = `
    // ==========================================
    // NEW: Reactive Math Calculations Studio
    // ==========================================
    const ReactiveMathStudio = () => {
        let mathA = paper.state(12);
        let mathB = paper.state(8);
        let mathC = paper.state(25);

        return paper.div("#math-studio.container", { style: { paddingTop: '6rem' } },
            paper.h2(".section-title", { style: { display: 'inline-flex', alignItems: 'center', gap: '8px' } },
                paper.icon('bolt', { size: 24, color: 'var(--primary)' }),
                "Reactive Mathematical Studio"
            ),
            paper.p({ style: { color: 'var(--text-muted)', marginTop: '-1.5rem', marginBottom: '3rem', maxWidth: '600px' } },
                "Unleash real-time formulas with our \`paper.math\` computed module. Adjust inputs and see calculations refresh instantly in the DOM with zero delay."
            ),
            
            paper.div(".grid", { style: { gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' } },
                // Controls Column
                paper.div(".glass-panel", { style: { padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' } },
                    paper.h3("Aesthetic Sliders Studio", { style: { color: '#fff', margin: '0' } }),
                    
                    paper.flex.col(
                        paper.flex.between(
                            paper.label("Variable A", { style: { fontWeight: '600', color: 'var(--text-muted)' } }),
                            paper.span(() => mathA.value, { style: { color: 'var(--primary)', fontWeight: 'bold' } })
                        ),
                        paper('input', {
                            type: 'range', min: '1', max: '100', value: '12',
                            style: { width: '100%', accentColor: 'var(--primary)' },
                            oninput: (e) => mathA.value = Number(e.target.value)
                        })
                    ),
                    
                    paper.flex.col(
                        paper.flex.between(
                            paper.label("Variable B", { style: { fontWeight: '600', color: 'var(--text-muted)' } }),
                            paper.span(() => mathB.value, { style: { color: 'var(--teal)', fontWeight: 'bold' } })
                        ),
                        paper('input', {
                            type: 'range', min: '1', max: '100', value: '8',
                            style: { width: '100%', accentColor: 'var(--teal)' },
                            oninput: (e) => mathB.value = Number(e.target.value)
                        })
                    ),
                    
                    paper.flex.col(
                        paper.flex.between(
                            paper.label("Variable C", { style: { fontWeight: '600', color: 'var(--text-muted)' } }),
                            paper.span(() => mathC.value, { style: { color: '#ec4899', fontWeight: 'bold' } })
                        ),
                        paper('input', {
                            type: 'range', min: '1', max: '100', value: '25',
                            style: { width: '100%', accentColor: '#ec4899' },
                            oninput: (e) => mathC.value = Number(e.target.value)
                        })
                    )
                ),
                
                // Formulate Computations Column
                paper.div(".glass-panel", { style: { padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' } },
                    paper.h3("Calculated Reactive Results", { style: { color: '#fff', margin: '0' } }),
                    
                    paper.div({ style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' } },
                        paper.div(".card", { style: { padding: '1rem', background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' } },
                            paper.p("Sum (A + B + C)", { style: { fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0' } }),
                            paper.h2(paper.math.sum(mathA, mathB, mathC), { style: { color: '#fff', margin: '8px 0 0 0' } })
                        ),
                        
                        paper.div(".card", { style: { padding: '1rem', background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' } },
                            paper.p("Average", { style: { fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0' } }),
                            paper.h2(paper.math.round(paper.math.avg(mathA, mathB, mathC), 1), { style: { color: 'var(--teal)', margin: '8px 0 0 0' } })
                        ),
                        
                        paper.div(".card", { style: { padding: '1rem', background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' } },
                            paper.p("Product (A * B)", { style: { fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0' } }),
                            paper.h2(paper.math.mul(mathA, mathB), { style: { color: '#ec4899', margin: '8px 0 0 0' } })
                        ),
                        
                        paper.div(".card", { style: { padding: '1rem', background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' } },
                            paper.p("Ratio (C / B)", { style: { fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0' } }),
                            paper.h2(paper.math.round(paper.math.div(mathC, mathB), 2), { style: { color: 'var(--primary)', margin: '8px 0 0 0' } })
                        )
                    )
                )
            )
        );
    };

    // ==========================================
    // NEW: Persistent Local CRUD Database Showcase
    // ==========================================
    const CRUDDatabaseShowcase = () => {
        let store = paper.crud('paper-viral-contacts', [
            { name: "Eldrex Reyes", role: "Library Author", status: "Active" },
            { name: "Satoshi Nakamoto", role: "Agile Architect", status: "Busy" },
            { name: "Ada Lovelace", role: "Reactivity Expert", status: "Away" }
        ]);

        let searchQuery = paper.state('');
        let newStatus = paper.state('Active');

        let filteredContacts = paper.computed(() => {
            let query = searchQuery.value.toLowerCase().trim();
            let all = store.items.value;
            if (!query) return all;
            return all.filter(item => 
                (item.name || '').toLowerCase().includes(query) || 
                (item.role || '').toLowerCase().includes(query)
            );
        });

        let listContainer = paper.div(".contacts-grid", { 
            style: { 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
                gap: '1.25rem',
                marginTop: '1.5rem'
            } 
        });

        // Computed reflow effect for database changes
        paper.computed(() => {
            listContainer.innerHTML = '';
            let contacts = filteredContacts.value;
            if (contacts.length === 0) {
                listContainer.appendChild(paper.div({ 
                    style: { 
                        gridColumn: '1 / -1', 
                        textAlign: 'center', 
                        padding: '3rem', 
                        color: 'var(--text-muted)',
                        border: '1px dashed var(--border)',
                        borderRadius: 'var(--radius)',
                        background: 'rgba(255,255,255,0.01)'
                    } 
                }, "No directory items found. Try adding a new record or reset search."));
                return;
            }
            
            contacts.forEach(user => {
                let card = paper.div(".contact-card.glass-panel", { 
                    style: { 
                        padding: '1.25rem', 
                        background: 'var(--surface)', 
                        border: '1px solid var(--border)', 
                        borderRadius: 'var(--radius)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        position: 'relative'
                    } 
                },
                    paper.flex.between(
                        paper.flex.center(
                            paper.div(user.name.charAt(0).toUpperCase(), { 
                                style: { 
                                    width: '36px', height: '36px', borderRadius: '50%', 
                                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--teal) 100%)', 
                                    color: '#fff', display: 'flex', alignItems: 'center', 
                                    justifyContent: 'center', fontWeight: 'bold', fontSize: '1rem' 
                                } 
                            }),
                            paper.flex.col(
                                paper.span(user.name, { style: { fontWeight: 'bold', color: '#fff', fontSize: '0.95rem' } }),
                                paper.span(user.role, { style: { fontSize: '0.8rem', color: 'var(--text-muted)' } })
                            ),
                            { style: { gap: '10px' } }
                        ),
                        paper.flex.row(
                            paper.button({
                                class: 'icon-btn',
                                style: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px' },
                                onclick: () => {
                                    let nameInput = paper.input('text', 'Name', { value: user.name });
                                    let roleInput = paper.input('text', 'Role', { value: user.role });
                                    let statusSelect = paper.select({ style: { width: '100%' } },
                                        paper.option('Active', { value: 'Active' }),
                                        paper.option('Busy', { value: 'Busy' }),
                                        paper.option('Away', { value: 'Away' })
                                    );
                                    statusSelect.value = user.status;
                                    
                                    let editModal = paper.modal(
                                        paper.flex.col(
                                            paper.flex.col(paper.label("Name"), nameInput),
                                            paper.flex.col(paper.label("Role"), roleInput),
                                            paper.flex.col(paper.label("Status"), statusSelect),
                                            paper.button("Update Record ⚡", {
                                                class: 'btn-primary',
                                                onclick: () => {
                                                    if (!nameInput.value.trim()) return paper.toast("Name cannot be empty!", "error");
                                                    store.update(user.id, {
                                                        name: nameInput.value,
                                                        role: roleInput.value,
                                                        status: statusSelect.value
                                                    });
                                                    editModal.hide();
                                                    paper.toast("Record updated successfully!", "success");
                                                }
                                            })
                                        ),
                                        "Edit Catalog Record"
                                    );
                                    document.body.appendChild(editModal);
                                    editModal.show();
                                }
                            }, paper.icon('edit', { size: 14, color: 'var(--teal)' })),
                            paper.button({
                                class: 'icon-btn',
                                style: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px' },
                                onclick: () => {
                                    store.delete(user.id);
                                    paper.toast("Contact safely removed.", "error");
                                }
                            }, paper.icon('trash', { size: 14, color: '#f43f5e' })),
                            { style: { gap: '6px' } }
                        ),
                        { style: { alignItems: 'center' } }
                    ),
                    paper.flex.between(
                        paper.span(user.status, { 
                            style: { 
                                fontSize: '0.75rem', 
                                padding: '2px 8px', 
                                borderRadius: '12px', 
                                background: user.status === 'Active' ? 'rgba(16,185,129,0.1)' : user.status === 'Busy' ? 'rgba(234,179,8,0.1)' : 'rgba(244,63,94,0.1)',
                                color: user.status === 'Active' ? '#10b981' : user.status === 'Busy' ? '#eab308' : '#f43f5e',
                                border: '1px solid ' + (user.status === 'Active' ? 'rgba(16,185,129,0.2)' : user.status === 'Busy' ? 'rgba(234,179,8,0.2)' : 'rgba(244,63,94,0.2)')
                            }
                        }),
                        paper.span(new Date(user.createdAt || Date.now()).toLocaleDateString(), { style: { fontSize: '0.75rem', color: 'var(--text-muted)' } }),
                        { style: { alignItems: 'center' } }
                    )
                );
                listContainer.appendChild(card);
            });
        });

        return paper.div("#crud-studio.container", { style: { paddingTop: '6rem' } },
            paper.h2(".section-title", { style: { display: 'inline-flex', alignItems: 'center', gap: '8px' } },
                paper.icon('database', { size: 24, color: 'var(--teal)' }),
                "Persistent Local CRUD Store"
            ),
            paper.p({ style: { color: 'var(--text-muted)', marginTop: '-1.5rem', marginBottom: '3rem', maxWidth: '600px' } },
                "Store, filter, and modify records in a database backed completely by \`paper.crud\`. Refresh the page - all changes are persistent natively in your local browser storage!"
            ),
            
            paper.div(".grid", { style: { gridTemplateColumns: '300px 1fr', gap: '2rem' } },
                // Create Sidebar Form
                paper.div(".glass-panel", { style: { padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' } },
                    paper.h3("Add Safe Record", { style: { color: '#fff', margin: '0' } }),
                    
                    paper.flex.col(
                        paper.label("Developer Name", { style: { fontSize: '0.8rem', color: 'var(--text-muted)' } }),
                        paper('input', {
                            type: 'text', placeholder: 'Name...',
                            style: { width: '100%' }
                        })
                    ),
                    
                    paper.flex.col(
                        paper.label("System Role", { style: { fontSize: '0.8rem', color: 'var(--text-muted)' } }),
                        paper('input', {
                            type: 'text', placeholder: 'e.g., Lead Engineer',
                            style: { width: '100%' }
                        })
                    ),
                    
                    paper.flex.col(
                        paper.label("Initial Status", { style: { fontSize: '0.8rem', color: 'var(--text-muted)' } }),
                        paper.select({
                            style: { width: '100%' },
                            onchange: (e) => newStatus.value = e.target.value
                        },
                            paper.option('Active', { value: 'Active' }),
                            paper.option('Busy', { value: 'Busy' }),
                            paper.option('Away', { value: 'Away' })
                        )
                    ),
                    
                    paper.button("Save to Database 💾", {
                        class: 'btn-primary',
                        style: { width: '100%', justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: '8px' },
                        onclick: (e) => {
                            let inputName = document.querySelector("#crud-studio input[placeholder='Name...']");
                            let inputRole = document.querySelector("#crud-studio input[placeholder='e.g., Lead Engineer']");
                            
                            let nameVal = inputName ? inputName.value.trim() : '';
                            let roleVal = inputRole ? inputRole.value.trim() : '';
                            
                            if(!nameVal) return paper.toast("Please specify a developer name!", "error");
                            
                            store.create({
                                name: nameVal,
                                role: roleVal || 'Contributor',
                                status: newStatus.value
                            });
                            
                            if (inputName) inputName.value = '';
                            if (inputRole) inputRole.value = '';
                            
                            paper.toast("Record persistent created! 🎉", "success");
                        }
                    })
                ),
                
                // Live View catalog list area
                paper.div(".catalog-preview-area.glass-panel", { style: { padding: '1.5rem', display: 'flex', flexDirection: 'column' } },
                    paper.flex.between(
                        paper.div(
                            paper.span(() => \`Safe Cache: \${store.items.value.length} Developers\`, { 
                                style: { 
                                    fontWeight: 'bold', color: '#fff', fontSize: '1rem',
                                    display: 'inline-flex', alignItems: 'center', gap: '6px'
                                } 
                            })
                        ),
                        paper.button({
                            class: 'toolbar-btn',
                            style: { borderColor: '#f43f5e', color: '#f43f5e', display: 'inline-flex', alignItems: 'center', gap: '6px' },
                            onclick: () => {
                                store.clear();
                                paper.toast("Database catalog purged.", "error");
                            }
                        }, paper.icon('trash', { size: 14, color: '#f43f5e' }), "Reset Store")
                    ),
                    
                    paper.div({ style: { marginTop: '1rem' } },
                        paper('input', {
                            type: 'text', placeholder: '🔍 Reactively Search Contacts...',
                            style: { width: '100%' },
                            oninput: (e) => searchQuery.value = e.target.value
                        })
                    ),
                    
                    listContainer
                )
            )
        );
    };
`;

// Insert the functions right before "const MainApp = () => {"
const mainAppStr = 'const MainApp = () => {';
const mainAppIndex = content.indexOf(mainAppStr);
if (mainAppIndex === -1) {
    throw new Error("Could not find MainApp declaration!");
}

content = content.substring(0, mainAppIndex) + showcasesCode + '\n' + content.substring(mainAppIndex);

// Now update MainApp's return statement to include the two new sections
const fragmentStr = 'return paper.fragment(';
const fragIndex = content.indexOf(fragmentStr);
if (fragIndex === -1) {
    throw new Error("Could not find paper.fragment in MainApp!");
}

const targetInsertIndex = fragIndex + fragmentStr.length;
content = content.substring(0, targetInsertIndex) + '\n            ReactiveMathStudio(),\n            CRUDDatabaseShowcase(),' + content.substring(targetInsertIndex);

fs.writeFileSync(appPath, content, 'utf8');
console.log("🚀 app.js successfully updated with Reactive Math Studio and persistent CRUD Database showcases!");
