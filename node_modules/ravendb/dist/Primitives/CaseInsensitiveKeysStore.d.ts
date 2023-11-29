export declare class CaseInsensitiveKeysStore {
    private _originalKeys;
    getKey(key: string): string;
    getKeys(): IterableIterator<string>;
    setKey(origKey: string): string;
    deleteKey(origKey: string): string;
    normalizeKey(key: string): string;
}
