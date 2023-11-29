import { DocumentInfo } from "./DocumentInfo";
export declare class DocumentsById {
    _inner: Map<string, DocumentInfo>;
    constructor();
    getValue(id: string): DocumentInfo;
    add(info: DocumentInfo): void;
    remove(id: string): boolean;
    clear(): void;
    getCount(): number;
    entries(): IterableIterator<[string, DocumentInfo]>;
}
