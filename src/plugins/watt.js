/**
 * PAPER WATT SYSTEM
 * Web App Tracking Transparency.
 * Intercepts hardware API calls to show branded permission modals before executing.
 * Manages tracking permission prompts, privacy tiers, script blocks, and sandboxes.
 */
(function() {
    // 1. Initialize papyr.watt APIs
    papyr.watt = {
        setTier(tier) {
            if (papyr.security && typeof papyr.security.setTier === 'function') {
                papyr.security.setTier(tier);
            }
        },
        getTier() {
            return papyr.security ? papyr.security.currentTier : 'default';
        },
        hasConsent() {
            return papyr.security ? papyr.security.hasConsent : false;
        },
        requestTracking(options = {}) {
            const { purpose = "We use data to personalize your experience and keep this app free.", onAllow = () => {}, onDeny = () => {} } = options;
            
            const currentTier = this.getTier();
            
            if (currentTier === 'none') {
                if (papyr.security) papyr.security.setConsent(true);
                onAllow();
                return Promise.resolve(true);
            }
            
            if (currentTier === 'high') {
                if (papyr.security) {
                    papyr.security.setConsent(false);
                    papyr.security.blockThirdPartyScripts();
                }
                onDeny();
                return Promise.resolve(false);
            }
            
            return new Promise((resolve) => {
                if (currentTier === 'minimal') {
                    // Render inline banner pill at bottom of page
                    if (typeof document === 'undefined') {
                        onDeny();
                        resolve(false);
                        return;
                    }
                    
                    let banner = papyr.div('.watt-banner-pill',
                        papyr.span(purpose, { style: { fontSize: '0.85rem', color: '#cbd5e1' } }),
                        papyr.flex.row(
                            papyr.button("Opt Out", {
                                style: { background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.3)', color: '#fda4af', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' },
                                onclick: () => {
                                    if (papyr.security) {
                                        papyr.security.setConsent(false);
                                        papyr.security.blockThirdPartyScripts();
                                    }
                                    onDeny();
                                    banner.remove();
                                    resolve(false);
                                }
                            }),
                            papyr.button("Allow", {
                                style: { background: '#14b8a6', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' },
                                onclick: () => {
                                    if (papyr.security) papyr.security.setConsent(true);
                                    onAllow();
                                    banner.remove();
                                    resolve(true);
                                }
                            }),
                            { style: { gap: '8px' } }
                        )
                    );
                    document.body.appendChild(banner);
                } else {
                    // default mode: Pop up beautiful glassmorphic modal
                    if (!papyr.modal) {
                        // Fallback to confirm
                        let ok = confirm(`${purpose}\n\nAllow tracking?`);
                        if (ok) {
                            if (papyr.security) papyr.security.setConsent(true);
                            onAllow();
                            resolve(true);
                        } else {
                            if (papyr.security) {
                                papyr.security.setConsent(false);
                                papyr.security.blockThirdPartyScripts();
                            }
                            onDeny();
                            resolve(false);
                        }
                        return;
                    }
                    
                    let consentModal = papyr.modal({
                        title: "🔒 Data Transparency Request",
                        animation: 'glass-pop',
                        content: papyr.div({ style: { display: 'flex', flexDirection: 'column', gap: '15px' } },
                            papyr.p(purpose, { style: { margin: 0, lineHeight: '1.5', color: '#cbd5e1' } }),
                            papyr.p("WATT Protection Guard: We believe in complete control over your personal data. Denying tracking blocks ad trackers and sandboxes identifiers safely.", { 
                                style: { margin: 0, fontSize: '0.8rem', color: '#64748b' } 
                            }),
                            papyr.flex.row(
                                papyr.button("Ask App Not to Track", {
                                    style: { background: 'rgba(255,255,255,0.05)', color: '#fda4af', border: '1px solid rgba(244,63,94,0.3)', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', flex: 1 },
                                    onclick: () => {
                                        consentModal.close();
                                        if (papyr.security) {
                                            papyr.security.setConsent(false);
                                            papyr.security.blockThirdPartyScripts();
                                        }
                                        onDeny();
                                        if (papyr.toast) papyr.toast("Ad tracking blocked securely.", "info");
                                        resolve(false);
                                    }
                                }),
                                papyr.button("Allow Personalization", {
                                    style: { background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', flex: 1, fontWeight: 'bold' },
                                    onclick: () => {
                                        consentModal.close();
                                        if (papyr.security) papyr.security.setConsent(true);
                                        onAllow();
                                        if (papyr.toast) papyr.toast("Preferences saved successfully.", "success");
                                        resolve(true);
                                    }
                                }),
                                { style: { gap: '12px', marginTop: '10px' } }
                            )
                        )
                    });
                }
            });
        }
    };

    // 2. Hardware permissions logic
    const requestPermission = (title, reason, iconPath, onAllow) => {
        return new Promise((resolve, reject) => {
            if (!papyr.modal) {
                // Fallback to native confirm if UI components aren't loaded
                let ok = confirm(`${title}\n\n${reason}\n\nAllow access?`);
                if (ok) resolve(onAllow());
                else reject(new Error("Permission denied by user."));
                return;
            }

            let permissionModal = papyr.modal({
                title: title,
                animation: 'glass-pop',
                content: papyr.div({ style: { display: 'flex', flexDirection: 'column', gap: '15px' } },
                    papyr.p(reason, { style: { margin: 0, lineHeight: '1.5' } }),
                    papyr.p("We believe in Data Transparency. This action will trigger a native browser prompt.", { 
                        style: { margin: 0, fontSize: '0.85rem', color: '#94a3b8' } 
                    }),
                    papyr.flex.row(
                        papyr.button("Deny", {
                            style: { background: 'transparent', color: '#f87171', border: '1px solid #f87171', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', flex: 1 },
                            onclick: () => {
                                permissionModal.close();
                                reject(new Error("Permission denied via WATT."));
                                if (papyr.toast) papyr.toast("Access denied.", "error");
                            }
                        }),
                        papyr.button("Allow Access", {
                            style: { background: '#3b82f6', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', flex: 1, fontWeight: 'bold' },
                            onclick: async () => {
                                permissionModal.close();
                                try {
                                    let result = await onAllow();
                                    resolve(result);
                                } catch (e) {
                                    reject(e);
                                }
                            }
                        }),
                        { style: { gap: '10px', marginTop: '10px' } }
                    )
                )
            });
        });
    };

    // Override camera to add request() if camera API exists
    if (papyr.camera) {
        const originalCameraOpen = papyr.camera.open.bind(papyr.camera);
        papyr.camera.request = (reason, videoElementId = null) => {
            return requestPermission(
                "Camera Access Required",
                reason || "This application requires access to your camera.",
                "camera",
                () => originalCameraOpen(videoElementId)
            );
        };
    }

    // Override location to add request() if location API exists
    if (papyr.location) {
        const originalLocationGet = papyr.location.get.bind(papyr.location);
        papyr.location.request = (reason) => {
            return requestPermission(
                "Location Access Required",
                reason || "This application requires access to your GPS coordinates.",
                "map-pin",
                () => originalLocationGet()
            );
        };
    }

    // Process any initial privacy settings set prior to WATT initialization
    if (papyr._initialPrivacy) {
        papyr.watt.setTier(papyr._initialPrivacy);
        delete papyr._initialPrivacy;
    }
})();
