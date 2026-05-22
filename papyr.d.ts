/**
 * Papyr.js Type Definitions
 * Unlocks VS Code IntelliSense and Autocomplete for Vanilla JS developers.
 */

declare namespace papyr {
    /** Reactive state primitive */
    export function state<T>(initialValue: T): { value: T; subscribe(fn: (val: T) => void): void };
    
    /** Computed reactive state */
    export function computed<T>(computeFn: () => T): { value: T; subscribe(fn: (val: T) => void): void };
    
    /** Create a basic HTML Element */
    export function el(tag: string, ...args: any[]): HTMLElement;
    
    /** Mounts a component to a DOM selector */
    export function mount(selector: string, component: HTMLElement | DocumentFragment): void;

    /** Core DOM element wrappers */
    export function div(...args: any[]): HTMLElement;
    export function span(...args: any[]): HTMLElement;
    export function p(...args: any[]): HTMLElement;
    export function a(...args: any[]): HTMLElement;
    export function img(...args: any[]): HTMLElement;
    export function button(...args: any[]): HTMLElement;
    export function input(...args: any[]): HTMLElement;
    export function form(...args: any[]): HTMLElement;
    export function h1(...args: any[]): HTMLElement;
    export function h2(...args: any[]): HTMLElement;
    export function h3(...args: any[]): HTMLElement;
    export function ul(...args: any[]): HTMLElement;
    export function li(...args: any[]): HTMLElement;
    
    /** Layout Helpers */
    export function row(...args: any[]): HTMLElement;
    export function col(...args: any[]): HTMLElement;
    
    /** Flexbox utilities */
    export const flex: {
        center(...args: any[]): HTMLElement;
        between(...args: any[]): HTMLElement;
        col(...args: any[]): HTMLElement;
    };

    /** Object-Oriented Base Component */
    export class component {
        constructor();
        render(): HTMLElement;
    }

    /** Object-Relational Model */
    export class model {
        id?: string;
        constructor(data?: any);
        save(): this;
        delete(): void;
        static create<T extends model>(this: new (data: any) => T, data: any): T;
        static find<T extends model>(this: new (data: any) => T, id: string): T | null;
        static all<T extends model>(this: new (data: any) => T): T[];
        static watch<T extends model>(this: new (data: any) => T, callback: (items: T[]) => void): () => void;
    }

    /** Unified Database API */
    export function db(collectionName: string, engine?: 'local'|'session'|'firebase'|'sqlite'): {
        state: { value: any[] };
        insert(item: any): any;
        find(id: string): any;
        update(id: string, data: any): void;
        delete(id: string): void;
        clear(): void;
        watch(callback: (data: any[]) => void): () => void;
    };

    export const storage: {
        set(key: string, value: any): void;
        get(key: string): any;
    };

    export const session: {
        set(key: string, value: any): void;
        get(key: string): any;
    };

    /** Fetch API Wrappers */
    export const api: {
        get(url: string, headers?: any): Promise<any>;
        post(url: string, data: any, headers?: any): Promise<any>;
    };

    /** PWA / Offline support */
    export const pwa: {
        init(swPath?: string): Promise<void>;
    };

    /** Debugging Suite */
    export function log(...data: any[]): void;
    export function warn(...data: any[]): void;

    /** Native Browser APIs */
    export const clipboard: {
        copy(text: string): Promise<void>;
        read(): Promise<string>;
    };
    
    export const location: {
        get(): Promise<GeolocationPosition>;\n        request(reason: string): Promise<GeolocationPosition>;
    };
    
    export const camera: {
        open(videoElementId?: string): Promise<MediaStream>;\n        request(reason: string, videoElementId?: string): Promise<MediaStream>;
        stop(): void;
    };
    
    export function vibrate(pattern: number | number[]): void;

    /** Math & Charting Plugins */
    export const math: {
        calc(formula: string): number;
        currency(amount: number): string;
    };
    
    export function chart(type: 'bar' | 'line' | 'pie', data: number[], labels: string[], options?: any): HTMLElement;

    /** Design Engine */
    export function glass(...args: any[]): HTMLElement;
    export function center(...args: any[]): HTMLElement;
    export function left(...args: any[]): HTMLElement;
    export function right(...args: any[]): HTMLElement;
    export function justify(...args: any[]): HTMLElement;
    export function template(name: string): HTMLElement;

    /** Animate Extensions */
    export function parallax(selector: string, speed?: number): void;
    export function physics(options?: { gravity?: number, bounce?: number, friction?: number }): (el: HTMLElement) => HTMLElement;

    /** Particles Engine */
    export function particles(options?: { type?: 'snow' | 'stars' | 'fire', count?: number, speed?: number, color?: string }): HTMLCanvasElement;

    /** UI Components */
    export function toast(message: string, type?: 'default' | 'error' | 'success'): void;
    export function modal(options?: { title?: string, content?: any, animation?: string, onClose?: () => void }): { close: () => void };
    export function sheet(options?: { content?: any }): void;

    /** Security Kernel */
    export const security: {
        sanitize(html: string): string;
        use(provider: 'disable' | any): void;
    };

    /** Layout Engine */
    export const layout: {
        flex(options?: any, ...children: any[]): HTMLElement;
        grid(options?: any, ...children: any[]): HTMLElement;
        row(...children: any[]): HTMLElement;
        col(...children: any[]): HTMLElement;
        dashboard(options?: { sidebar?: any, header?: any, main?: any, footer?: any }): HTMLElement;
    };
}