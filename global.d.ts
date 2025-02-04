declare global {
    interface Window {
        fetch: typeof globalThis.fetch;
    }

    interface Global {
        fetch: typeof globalThis.fetch;
    }
}