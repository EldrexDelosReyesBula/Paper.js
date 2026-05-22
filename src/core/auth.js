/**
 * PAPYR AUTHENTICATION ENGINE
 * Handles login, logout, and registration logic. Provides a unified interface
 * for Local, JWT, Firebase Auth, and OAuth.
 * Updated to run modularly inside the Papyr Kernel context.
 */

coreInitializers.push((papyr) => {
    papyr.auth = {
        user: papyr.state(null), // Reactive current user state
        
        _config: { provider: 'local' },

        async _hashPassword(password) {
            if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
                const msgBuffer = new TextEncoder().encode(password);
                const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            }
            // Deterministic numeric hashing fallback for Node.js/testing environments:
            let hash = 0;
            for (let i = 0; i < password.length; i++) {
                const char = password.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            return "sha256_poly_" + Math.abs(hash).toString(16);
        },

        init(config) {
            this._config = { ...this._config, ...config };
            
            // Auto-login check for local token
            if (this._config.provider === 'local') {
                let token = papyr.storage.get("auth_token");
                if (token) {
                    let sessions = papyr.storage.get("papyr_auth_sessions") || {};
                    let username = sessions[token];
                    if (username) {
                        let users = papyr.storage.get("papyr_auth_users") || {};
                        let userRecord = users[username];
                        if (userRecord) {
                            this.user.value = { id: userRecord.id, username: username, token };
                        } else {
                            papyr.storage.set("auth_token", null);
                        }
                    } else {
                        papyr.storage.set("auth_token", null);
                    }
                }
            }
        },

        async login(credentials) {
            if (this._config.provider === 'local') {
                if (!credentials.username || !credentials.password) {
                    return Promise.reject(new Error("Authentication failed: Username and password are required."));
                }
                let users = papyr.storage.get("papyr_auth_users") || {};
                let userRecord = users[credentials.username];
                if (!userRecord) {
                    return Promise.reject(new Error("Authentication failed: Username does not exist."));
                }
                
                const hashedPassword = await this._hashPassword(credentials.password);
                if (userRecord.passwordHash !== hashedPassword) {
                    return Promise.reject(new Error("Authentication failed: Incorrect password."));
                }
                
                const token = "local_session_" + Math.random().toString(36).substr(2, 9);
                let sessions = papyr.storage.get("papyr_auth_sessions") || {};
                sessions[token] = credentials.username;
                papyr.storage.set("papyr_auth_sessions", sessions);
                
                papyr.storage.set("auth_token", token);
                let userObj = { id: userRecord.id, username: credentials.username, token };
                this.user.value = userObj;
                return userObj;
            } else if (this._config.provider === 'firebase') {
                if (papyr.firebase && papyr.firebase.auth) {
                    return papyr.firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password)
                        .then(res => {
                            this.user.value = res.user;
                            return res.user;
                        });
                } else {
                    return Promise.reject(new Error("Firebase not initialized"));
                }
            }
            return Promise.reject(new Error("Provider not supported"));
        },

        async register(credentials) {
            if (this._config.provider === 'local') {
                if (!credentials.username || !credentials.password) {
                    return Promise.reject(new Error("Registration failed: Username and password are required."));
                }
                let users = papyr.storage.get("papyr_auth_users") || {};
                if (users[credentials.username]) {
                    return Promise.reject(new Error("Registration failed: Username already exists."));
                }
                
                const hashedPassword = await this._hashPassword(credentials.password);
                users[credentials.username] = {
                    id: Date.now(),
                    username: credentials.username,
                    passwordHash: hashedPassword
                };
                papyr.storage.set("papyr_auth_users", users);
                
                const token = "local_session_" + Math.random().toString(36).substr(2, 9);
                let sessions = papyr.storage.get("papyr_auth_sessions") || {};
                sessions[token] = credentials.username;
                papyr.storage.set("papyr_auth_sessions", sessions);
                
                papyr.storage.set("auth_token", token);
                let userObj = { id: users[credentials.username].id, username: credentials.username, token };
                this.user.value = userObj;
                return userObj;
            }
            return Promise.reject(new Error("Registration not implemented for " + this._config.provider));
        },

        logout() {
            if (this._config.provider === 'local') {
                let token = papyr.storage.get("auth_token");
                if (token) {
                    let sessions = papyr.storage.get("papyr_auth_sessions") || {};
                    delete sessions[token];
                    papyr.storage.set("papyr_auth_sessions", sessions);
                }
                papyr.storage.set("auth_token", null);
                this.user.value = null;
                return Promise.resolve();
            } else if (this._config.provider === 'firebase' && papyr.firebase) {
                return papyr.firebase.auth().signOut().then(() => {
                    this.user.value = null;
                });
            }
        }
    };
});
