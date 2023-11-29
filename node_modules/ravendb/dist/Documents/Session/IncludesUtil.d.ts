export declare class IncludesUtil {
    static include(document: object, include: string, loadId: (id: string) => void): void;
    static requiresQuotes(include: string, escapedIncludeSetter: (value: string) => void): boolean;
}
