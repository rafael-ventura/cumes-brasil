import { QueryToken } from "./QueryToken";
export declare class FromToken extends QueryToken {
    private readonly _collectionName;
    private readonly _indexName;
    private readonly _dynamic;
    private readonly _alias;
    get collection(): string;
    get indexName(): string;
    get isDynamic(): boolean;
    alias(): string;
    private constructor();
    private constructor();
    static create(indexName: string, collectionName: string, alias: string): FromToken;
    private static WHITE_SPACE_CHARS;
    writeTo(writer: any): void;
}
