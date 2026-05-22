/**
 * PAPYR REACTIVITY SYSTEM
 * 
 * Auto-tracking reactive state variables and computed logic nodes.
 * Updated to run modularly inside the Papyr Kernel context.
 */

coreInitializers.push((papyr) => {
    
    /**
     * Creates an auto-tracking reactive state variable.
     * 
     * @param {*} val Initial reactive state value
     * @returns {PaperState} Reactive State accessor interface
     */
    papyr.state = (val) => {
        let subscribers = new Set();
        let stateObj = {
            get value() {
                if (activeEffect) subscribers.add(activeEffect);
                return val;
            },
            set value(newVal) {
                let oldVal = val;
                val = newVal;
                papyr.diagnostics.trackUpdate(stateObj, newVal, oldVal);
                subscribers.forEach(sub => sub(newVal));
                
                // Trigger hooks
                papyr.plugins.triggerHook('onUpdate', stateObj);
            },
            subscribe(sub) {
                subscribers.add(sub);
                sub(val);
                return () => subscribers.delete(sub);
            },
            dump() {
                return val;
            }
        };
        papyr.state.register(stateObj);
        return stateObj;
    };

    // Initialize state registries on the state function itself for this kernel instance
    papyr.state.states = new Set();
    papyr.state.register = (s) => papyr.state.states.add(s);
    papyr.state.list = () => Array.from(papyr.state.states);
    papyr.state.dump = () => {
        let res = {};
        let idx = 0;
        papyr.state.states.forEach(s => {
            res[`state_${idx++}`] = s.value;
        });
        return res;
    };

    /**
     * Generates an auto-updating computed reactive variable.
     * 
     * @param {function} fn Tracked callback evaluating state operations
     * @returns {PaperComputed} Read-only tracking interface
     */
    papyr.computed = (fn) => {
        let subscribers = new Set();
        let currentVal;
        let effect = () => {
            currentVal = fn();
            subscribers.forEach(sub => sub(currentVal));
        };
        
        activeEffect = effect;
        currentVal = fn();
        activeEffect = null;
        
        return {
            get value() {
                if (activeEffect) subscribers.add(activeEffect);
                return currentVal;
            },
            subscribe(sub) {
                subscribers.add(sub);
                sub(currentVal);
                return () => subscribers.delete(sub);
            }
        };
    };

    /**
     * Switches visual DOM subtrees reactively based on condition updates.
     * 
     * @param {PaperState} conditionState Reactive condition state to track
     * @param {HTMLElement|function} trueVal Rendered target when state is truthy
     * @param {HTMLElement|function} [falseVal] Optional target when state is falsy
     * @returns {HTMLDivElement} Content container fragment
     */
    papyr.if = (conditionState, trueVal, falseVal) => {
        let container = papyr.div({ style: { display: 'contents' } });
        let currentEl = null;
        
        let update = (val) => {
            if (currentEl) currentEl.remove();
            let target = val ? trueVal : falseVal;
            if (target) {
                currentEl = typeof target === 'function' ? target() : target;
                container.appendChild(currentEl);
            } else {
                currentEl = null;
            }
        };
        
        if (conditionState && typeof conditionState.subscribe === 'function') {
            conditionState.subscribe(update);
        } else {
            update(!!conditionState);
        }
        return container;
    };

    /**
     * Reactively renders a list of DOM elements from an array state.
     * 
     * @param {PaperState} arrayState Reactive state containing an array
     * @param {function} renderCallback Function returning an HTMLElement for each item
     * @returns {HTMLDivElement} Content container fragment
     */
    papyr.for = (arrayState, renderCallback) => {
        let container = papyr.div({ style: { display: 'contents' } });
        
        let update = (arr) => {
            container.innerHTML = '';
            if (Array.isArray(arr)) {
                arr.forEach((item, index) => {
                    let el = renderCallback(item, index);
                    if (el instanceof Element || el instanceof DocumentFragment) {
                        container.appendChild(el);
                    }
                });
            }
        };
        
        if (arrayState && typeof arrayState.subscribe === 'function') {
            arrayState.subscribe(update);
        } else {
            update(arrayState);
        }
        return container;
    };
});
