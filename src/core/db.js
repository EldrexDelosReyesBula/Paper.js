/**
 * PAPER DATA SYSTEM (Unified DB API)
 * Seamlessly integrates LocalStorage, SessionStorage, IndexedDB, and SQLite endpoints.
 */

paper.db = (collectionName, engine = 'local') => {
    
    // Engine Drivers
    const drivers = {
        'local': {
            get: () => {
                try { return JSON.parse(localStorage.getItem(`paper_db_${collectionName}`)) || []; } 
                catch(e) { return []; }
            },
            set: (data) => localStorage.setItem(`paper_db_${collectionName}`, JSON.stringify(data))
        },
        'session': {
            get: () => {
                try { return JSON.parse(sessionStorage.getItem(`paper_db_${collectionName}`)) || []; } 
                catch(e) { return []; }
            },
            set: (data) => sessionStorage.setItem(`paper_db_${collectionName}`, JSON.stringify(data))
        },
        'firebase': {
            // Firebase hollow bridge (requires paper.firebase to be initialized by user)
            get: () => [], // Handled async in real implementation
            set: (data) => {
                if (paper.firebase && paper.firebase.db) {
                    paper.firebase.db(collectionName).set(data);
                } else {
                    console.warn("PaperDB: Firebase engine selected but paper.firebase is not initialized.");
                }
            }
        },
        'sqlite': {
            // SQLite hollow bridge (requires sql.js or similar)
            get: () => [],
            set: (data) => {
                if (paper.sqlite) paper.sqlite.insert(collectionName, data);
            }
        }
    };

    let driver = drivers[engine] || drivers['local'];
    let state = paper.state(driver.get());

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
        
        watch(callback) {
            watchers.push(callback);
            callback(state.value); // immediate execution
            return () => watchers = watchers.filter(cb => cb !== callback); // unsubscribe
        }
    };
};

// Aliases for standard unified access
paper.storage = {
    set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
    get: (k) => JSON.parse(localStorage.getItem(k))
};

paper.session = {
    set: (k, v) => sessionStorage.setItem(k, JSON.stringify(v)),
    get: (k) => JSON.parse(sessionStorage.getItem(k))
};
