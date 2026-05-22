/**
 * PAPER WATT SYSTEM
 * Web App Tracking Transparency.
 * Intercepts hardware API calls to show branded permission modals before executing.
 */
(function() {
    if (!papyr.camera || !papyr.location) {
        if (papyr.warn) papyr.warn("WATT system requires browser-api.js to be loaded first.");
        return;
    }

    const requestPermission = (title, reason, iconPath, onAllow) => {
        return new Promise((resolve, reject) => {
            if (!papyr.modal) {
                // Fallback to native confirm if UI components aren't loaded
                let ok = confirm(`${title}\\n\\n${reason}\\n\\nAllow access?`);
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
                    papyr.flex.justify(
                        papyr.button("Deny", {
                            style: { background: 'transparent', color: '#f87171', border: '1px solid #f87171', padding: '8px 16px', borderRadius: '6px' },
                            onclick: () => {
                                permissionModal.close();
                                reject(new Error("Permission denied via WATT."));
                                if (papyr.toast) papyr.toast("Access denied.", "error");
                            }
                        }),
                        papyr.button("Allow Access", {
                            style: { background: '#3b82f6', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px' },
                            onclick: async () => {
                                permissionModal.close();
                                try {
                                    let result = await onAllow();
                                    resolve(result);
                                } catch (e) {
                                    reject(e);
                                }
                            }
                        })
                    )
                )
            });
        });
    };

    // Override camera to add request()
    const originalCameraOpen = papyr.camera.open.bind(papyr.camera);
    papyr.camera.request = (reason, videoElementId = null) => {
        return requestPermission(
            "Camera Access Required",
            reason || "This application requires access to your camera.",
            "camera",
            () => originalCameraOpen(videoElementId)
        );
    };

    // Override location to add request()
    const originalLocationGet = papyr.location.get.bind(papyr.location);
    papyr.location.request = (reason) => {
        return requestPermission(
            "Location Access Required",
            reason || "This application requires access to your GPS coordinates.",
            "map-pin",
            () => originalLocationGet()
        );
    };
})();
