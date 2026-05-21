/**
 * PAPER REACTIVITY SYSTEM
 * 
 * Auto-tracking reactive state variables and computed logic nodes.
 */

/**
 * Creates an auto-tracking reactive state variable.
 * 
 * @param {*} val Initial reactive state value
 * @returns {PaperState} Reactive State accessor interface
 */
paper.state = (val) => {
    let subscribers = new Set();
    return {
        get value() {
            if (activeEffect) subscribers.add(activeEffect);
            return val;
        },
        set value(newVal) {
            val = newVal;
            subscribers.forEach(sub => sub(newVal));
        },
        subscribe(sub) {
            subscribers.add(sub);
            sub(val);
            return () => subscribers.delete(sub);
        }
    };
};

/**
 * Generates an auto-updating computed reactive variable.
 * 
 * @param {function} fn Tracked callback evaluating state operations
 * @returns {PaperComputed} Read-only tracking interface
 */
paper.computed = (fn) => {
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
paper.if = (conditionState, trueVal, falseVal) => {
    let container = paper.div({ style: { display: 'contents' } });
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
