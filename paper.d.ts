/**
 * TypeScript Typings for "Paper" - The Dead-Simple HTML Library
 * Provides VS Code and other modern IDEs with standard autocomplete, hover tooltips, and type parameters.
 */

interface PaperState<T> {
    /**
     * Get or set the reactive state value. Mutating this value triggers automatic subscriber re-renders.
     */
    value: T;
    /**
     * Subscribe a callback to state changes. Returns a function to unsubscribe.
     */
    subscribe(fn: (val: T) => void): () => void;
}

interface PaperComputed<T> {
    /**
     * Read-only reactive computed value, tracked automatically.
     */
    readonly value: T;
    /**
     * Subscribe a callback to computed changes.
     */
    subscribe(fn: (val: T) => void): () => void;
}

interface PaperRouteFn {
    (): HTMLElement | DocumentFragment;
}

interface PaperStatic {
    /**
     * Standard element creator.
     * @param tag Native HTML tag (e.g. 'div', 'span', 'button')
     * @param args Formatting selectors ('.class', '#id'), attribute object dictionaries, or children
     */
    (tag: string, ...args: any[]): HTMLElement;

    // ==========================================
    // NATIVE HTML TAG SHORTCUTS
    // ==========================================

    div(...args: any[]): HTMLDivElement;
    span(...args: any[]): HTMLSpanElement;
    p(...args: any[]): HTMLParagraphElement;
    h1(...args: any[]): HTMLHeadingElement;
    h2(...args: any[]): HTMLHeadingElement;
    h3(...args: any[]): HTMLHeadingElement;
    h4(...args: any[]): HTMLHeadingElement;
    h5(...args: any[]): HTMLHeadingElement;
    h6(...args: any[]): HTMLHeadingElement;
    button(...args: any[]): HTMLButtonElement;
    a(...args: any[]): HTMLAnchorElement;
    img(...args: any[]): HTMLImageElement;
    input(...args: any[]): HTMLInputElement;
    textarea(...args: any[]): HTMLTextAreaElement;
    select(...args: any[]): HTMLSelectElement;
    option(...args: any[]): HTMLOptionElement;
    ul(...args: any[]): HTMLUListElement;
    ol(...args: any[]): HTMLOListElement;
    li(...args: any[]): HTMLLIElement;
    table(...args: any[]): HTMLTableElement;
    thead(...args: any[]): HTMLTableSectionElement;
    tbody(...args: any[]): HTMLTableSectionElement;
    tr(...args: any[]): HTMLTableRowElement;
    td(...args: any[]): HTMLTableCellElement;
    th(...args: any[]): HTMLTableCellElement;
    form(...args: any[]): HTMLFormElement;
    label(...args: any[]): HTMLLabelElement;
    section(...args: any[]): HTMLElement;
    article(...args: any[]): HTMLElement;
    header(...args: any[]): HTMLElement;
    footer(...args: any[]): HTMLElement;
    nav(...args: any[]): HTMLElement;
    aside(...args: any[]): HTMLElement;
    main(...args: any[]): HTMLElement;
    pre(...args: any[]): HTMLPreElement;
    code(...args: any[]): HTMLElement;
    hr(...args: any[]): HTMLHRElement;
    br(...args: any[]): HTMLBRElement;

    // ==========================================
    // REACTION SYSTEM (Vue/SolidJS style)
    // ==========================================

    /**
     * Create an auto-tracking reactive state object.
     * @param val Initial state value
     */
    state<T>(val: T): PaperState<T>;

    /**
     * Create an automatically tracked computed state.
     * @param fn Callback that reads other reactive states to automatically recalculate
     */
    computed<T>(fn: () => T): PaperComputed<T>;

    /**
     * Toggles layout trees reactively based on a conditional state.
     * @param conditionState Reactive state to monitor
     * @param trueVal Element to render when true
     * @param falseVal Element to render when false
     */
    if(conditionState: any, trueVal: any, falseVal?: any): HTMLDivElement;

    // ==========================================
    // SPA ROUTING
    // ==========================================

    /**
     * Register a new hash path route.
     * @param path URL hash path (e.g. '/' or '/about')
     * @param componentFn Component renderer function
     */
    route(path: string, componentFn: PaperRouteFn): void;

    /**
     * Mounts the hash SPA router inside the page. Handles page swappings automatically on hash changes.
     */
    router(): HTMLDivElement;

    /**
     * Navigate programmatically to a hash path.
     * @param path Hash target path
     */
    navigate(path: string): void;

    // ==========================================
    // HIGH-LEVEL COMPONENTS (Paper-Complete)
    // ==========================================

    /**
     * Dynamic Grid Layout Component.
     */
    grid(cols: number, ...children: any[]): HTMLDivElement;

    /**
     * Flexible alignment component container.
     */
    flex: {
        row(...children: any[]): HTMLDivElement;
        col(...children: any[]): HTMLDivElement;
        center(...children: any[]): HTMLDivElement;
        between(...children: any[]): HTMLDivElement;
        around(...children: any[]): HTMLDivElement;
        wrap(...children: any[]): HTMLDivElement;
    };

    /**
     * Smart Autocomplete Input Component.
     */
    autoComplete(options: string[], placeholder?: string): HTMLDivElement;

    /**
     * Auto-suggest searching component querying external APIs.
     */
    autoSuggest(apiUrl: string, placeholder?: string): Promise<HTMLDivElement>;

    /**
     * Gorgeous Modal Dialog Component.
     */
    modal(content: any, title?: string): HTMLDivElement & { show(): void; hide(): void };

    /**
     * Slide-in dynamic notifications alert toast.
     */
    toast(message: string, type?: 'info' | 'success' | 'error', duration?: number): void;

    /**
     * Multi-tab visual container.
     */
    tabs(tabs: Array<{ title: string; content: any }>): HTMLDivElement;

    /**
     * Exquisite native data grid table generator.
     */
    table(headers: string[], data: any[]): HTMLTableElement;

    /**
     * Loading spinner wrapped fetch client querying APIs recursively.
     */
    fetch(url: string, options?: any): Promise<HTMLDivElement>;

    components: {
        navbar(logo: any, links: Array<{ text: string; href?: string; onclick?: any }>): HTMLElement;
        hero(title: string, subtitle: string, buttonText: string, buttonAction: any): HTMLElement;
        sidebar(items: Array<{ text: string; icon?: string; active?: boolean; onclick?: any } | string>): HTMLElement;
        footer(text: string, links?: Array<{ text: string; href: string }>): HTMLElement;
        carousel(images: string[]): HTMLDivElement;
    };

    // ==========================================
    // DEVELOPER DX & WIDGET UTILITIES
    // ==========================================

    /**
     * Inject custom CSS selector variables into the Document Head.
     */
    css(selector: string, styles: Record<string, string>): void;

    /**
     * Register a new global component shortcut function under paper.
     */
    component(name: string, renderFn: (...args: any[]) => HTMLElement | DocumentFragment): void;

    /**
     * Document fragment wrapper. Prevents repeated DOM paints.
     */
    fragment(...children: any[]): DocumentFragment;

    /**
     * Generate actual DOM trees from a raw HTML string safely.
     */
    html(htmlString: string): DocumentFragment;

    /**
     * Enable spellcheck alerts and developer trace logs.
     */
    debug(enable: boolean): void;

    /**
     * educational HTML inspector visualizing native trees in raw text.
     */
    inspect(component: HTMLElement): string;

    // ==========================================
    // ANIMATIONS
    // ==========================================

    fadeIn(el: HTMLElement, duration?: number): void;
    fadeOut(el: HTMLElement, duration?: number): void;
    animate(el: HTMLElement, properties: Record<string, string>, duration?: number): void;

    // ==========================================
    // SYSTEM AND STORAGE HELPERS
    // ==========================================

    storage(key: string, val?: any): any;
    copy(text: string): Promise<void>;
    delay(ms: number): Promise<void>;
    mount(selector: string, component: HTMLElement | DocumentFragment): Element | null;
    use(plugin: (paper: PaperStatic) => void): void;
    
    /**
     * Dynamically loads a CSS framework (like Tailwind or Bootstrap) into the page head.
     * Useful for zero-config starting of modern styling templates.
     */
    loadFramework(framework: 'tailwind' | 'bootstrap'): void;

    /**
     * Generates a modern inline vector SVG element for the preloaded system icons.
     * @param name Preloaded icon keyword key
     * @param options Custom configurations like size, color, strokeWidth, class, or style
     */
    icon(name: string, options?: { size?: number; color?: string; strokeWidth?: number; class?: string; style?: Record<string, string> }): SVGElement;
}

declare global {
    interface Window {
        paper: PaperStatic;
    }
    const paper: PaperStatic;
}

export = paper;
