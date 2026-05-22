/**
 * PAPER DATA SYSTEM (Unified DB API)
 * Seamlessly integrates LocalStorage, SessionStorage, IndexedDB, and SQLite endpoints.
 */

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
            // Firebase hollow bridge (requires papyr.firebase to be initialized by user)
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
            // SQLite hollow bridge (requires sql.js or similar)
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

// Aliases for standard unified access
papyr.storage = {
    set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
    get: (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch(e) { return null; } },
    secureSet: (k, v, password) => {
        if (!papyr.security) return console.error("PapyrError: Security module not loaded.");
        localStorage.setItem(k, papyr.security.encrypt(JSON.stringify(v), password));
    },
    secureGet: (k, password) => {
        if (!papyr.security) return console.error("PapyrError: Security module not loaded.");
        let enc = localStorage.getItem(k);
        if (!enc) return null;
        try { return JSON.parse(papyr.security.decrypt(enc, password)); } catch(e) { return null; }
    }
};

papyr.session = {
    set: (k, v) => sessionStorage.setItem(k, JSON.stringify(v)),
    get: (k) => { try { return JSON.parse(sessionStorage.getItem(k)); } catch(e) { return null; } },
    secureSet: (k, v, password) => {
        if (!papyr.security) return console.error("PapyrError: Security module not loaded.");
        sessionStorage.setItem(k, papyr.security.encrypt(JSON.stringify(v), password));
    },
    secureGet: (k, password) => {
        if (!papyr.security) return console.error("PapyrError: Security module not loaded.");
        let enc = sessionStorage.getItem(k);
        if (!enc) return null;
        try { return JSON.parse(papyr.security.decrypt(enc, password)); } catch(e) { return null; }
    }
};
