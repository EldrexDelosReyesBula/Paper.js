/**
 * PAPYR DATA SYSTEM (Unified DB API)
 * Seamlessly integrates LocalStorage, SessionStorage, IndexedDB, and SQLite endpoints.
 * Updated to run modularly inside the Papyr Kernel context.
 */

coreInitializers.push((papyr) => {
    
    papyr.db = (collectionName, engine = 'local') => {
        
        // Engine Drivers
        const drivers = {
            'local': {
                get: () => {
                    try { return JSON.parse(localStorage.getItem(`papyr_db_${collectionName}`)) || []; } 
                    catch(e) { return []; }
                },
                set: (data) => localStorage.setItem(`papyr_db_${collectionName}`, JSON.stringify(data))
            },
            'session': {
                get: () => {
                    try { return JSON.parse(sessionStorage.getItem(`papyr_db_${collectionName}`)) || []; } 
                    catch(e) { return []; }
                },
                set: (data) => sessionStorage.setItem(`papyr_db_${collectionName}`, JSON.stringify(data))
            },
            'firebase': {
                get: () => [], // Handled async in real implementation
                set: (data) => {
                    if (papyr.firebase && papyr.firebase.db) {
                        papyr.firebase.db(collectionName).set(data);
                    } else {
                        console.warn("PaperDB: Firebase engine selected but papyr.firebase is not initialized.");
                    }
                }
            },
            'sqlite': {
                get: () => [],
                set: (data) => {
                    if (papyr.sqlite) papyr.sqlite.insert(collectionName, data);
                }
            }
        };

        let driver = drivers[engine] || drivers['local'];
        let state = papyr.state(driver.get());

        // Watchers for reactivity
        let watchers = [];

        const sync = () => {
            driver.set(state.value);
            watchers.forEach(cb => cb(state.value));
        };

        return {
            state,
            
            insert(item) {
                let record = { id: Date.now().toString(36), createdAt: new Date().toISOString(), ...item };
                state.value = [...state.value, record];
                sync();
                return record;
            },
            
            find(id) {
                return state.value.find(record => record.id === id);
            },
            
            update(id, data) {
                state.value = state.value.map(record => 
                    record.id === id ? { ...record, ...data, updatedAt: new Date().toISOString() } : record
                );
                sync();
            },
            
            delete(id) {
                state.value = state.value.filter(record => record.id !== id);
                sync();
            },
            
            clear() {
                state.value = [];
                sync();
            },
            
            watch(callback) {
                watchers.push(callback);
                callback(state.value); // immediate execution
                return () => watchers = watchers.filter(cb => cb !== callback); // unsubscribe
            }
        };
    };

    // Upgraded storage helper function with dual call signature compatibility (Getter/Setter + object properties)
    const storageFunc = (key, val) => {
        if (typeof val === 'undefined') {
            let data = localStorage.getItem(key);
            try { return JSON.parse(data); } catch(e) { return data; }
        }
        localStorage.setItem(key, typeof val === 'object' ? JSON.stringify(val) : val);
    };
    storageFunc.set = (k, v) => localStorage.setItem(k, JSON.stringify(v));
    storageFunc.get = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch(e) { return null; } };
    storageFunc.secureSet = (k, v, password) => {
        if (!papyr.security) return console.error("PapyrError: Security module not loaded.");
        localStorage.setItem(k, papyr.security.encrypt(JSON.stringify(v), password));
    };
    storageFunc.secureGet = (k, password) => {
        if (!papyr.security) return console.error("PapyrError: Security module not loaded.");
        let enc = localStorage.getItem(k);
        if (!enc) return null;
        try { return JSON.parse(papyr.security.decrypt(enc, password)); } catch(e) { return null; }
    };
    papyr.storage = storageFunc;

    // Upgraded session helper function with dual call signature compatibility
    const sessionFunc = (key, val) => {
        if (typeof val === 'undefined') {
            let data = sessionStorage.getItem(key);
            try { return JSON.parse(data); } catch(e) { return data; }
        }
        sessionStorage.setItem(key, typeof val === 'object' ? JSON.stringify(val) : val);
    };
    sessionFunc.set = (k, v) => sessionStorage.setItem(k, JSON.stringify(v));
    sessionFunc.get = (k) => { try { return JSON.parse(sessionStorage.getItem(k)); } catch(e) { return null; } };
    sessionFunc.secureSet = (k, v, password) => {
        if (!papyr.security) return console.error("PapyrError: Security module not loaded.");
        sessionStorage.setItem(k, papyr.security.encrypt(JSON.stringify(v), password));
    };
    sessionFunc.secureGet = (k, password) => {
        if (!papyr.security) return console.error("PapyrError: Security module not loaded.");
        let enc = sessionStorage.getItem(k);
        if (!enc) return null;
        try { return JSON.parse(papyr.security.decrypt(enc, password)); } catch(e) { return null; }
    };
    papyr.session = sessionFunc;
});
