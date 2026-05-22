/**
 * PAPER AUTHENTICATION ENGINE
 * Handles login, logout, and registration logic. Provides a unified interface
 * for Local, JWT, Firebase Auth, and OAuth.
 */

papyr.auth = {
    user: papyr.state(null), // Reactive current user state
    
    _config: { provider: 'local' },

    init(config) {
        this._config = { ...this._config, ...config };
        
        // Auto-login check for local token
        if (this._config.provider === 'local') {
            let token = papyr.storage.get("auth_token");
            if (token) {
                // Dummy restore for local mode
                this.user.value = { token, username: 'LocalUser' };
            }
        }
    },

    login(credentials) {
        if (this._config.provider === 'local') {
            // Simulated local login
            let user = { id: Date.now(), ...credentials };
            papyr.storage.set("auth_token", "fake_jwt_" + Date.now());
            this.user.value = user;
            return Promise.resolve(user);
        } else if (this._config.provider === 'firebase') {
            if (papyr.firebase && papyr.firebase.auth) {
                return papyr.firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password)
                    .then(res => {
                        this.user.value = res.user;
                        return res.user;
                    });
            } else {
                return Promise.reject("Firebase not initialized");
            }
        }
        return Promise.reject("Provider not supported");
    },

    register(credentials) {
        if (this._config.provider === 'local') {
            // Simulated local registration
            let user = { id: Date.now(), ...credentials };
            papyr.storage.set("auth_token", "fake_jwt_" + Date.now());
            this.user.value = user;
            return Promise.resolve(user);
        }
        return Promise.reject("Registration not implemented for " + this._config.provider);
    },

    logout() {
        if (this._config.provider === 'local') {
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
