import { JSDOM } from 'jsdom';

/** A DOM must exist before any import: inputmask reads HTMLElement at module scope. */
const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost' });

const globalAny = global as any;

globalAny.window = dom.window;
globalAny.document = dom.window.document;

// jsdom implements no matchMedia, and inputmask (via @formio/js) reads it at module
// scope, same as HTMLElement above. Defined on the window so the copy loop below
// picks it up too.
if (!dom.window.matchMedia) {
    (dom.window as any).matchMedia = (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
    });
}
// navigator is a getter on modern node, so it cannot be assigned directly.
Object.defineProperty(global, 'navigator', { value: dom.window.navigator, configurable: true });
globalAny.IS_REACT_ACT_ENVIRONMENT = true;

for (const key of Object.getOwnPropertyNames(dom.window)) {
    if (!(key in global)) {
        try {
            globalAny[key] = (dom.window as any)[key];
        } catch {
            /* read-only window properties, not needed here */
        }
    }
}

export { dom };
