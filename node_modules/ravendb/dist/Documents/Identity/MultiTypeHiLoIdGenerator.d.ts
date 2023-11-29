import { HiloIdGenerator } from "./HiloIdGenerator";
import { IRavenObject } from "../../Types/IRavenObject";
import { DocumentStore } from "../DocumentStore";
import { DocumentConventions } from "../Conventions/DocumentConventions";
export declare class MultiTypeHiLoIdGenerator {
    private readonly _sem;
    protected _idGeneratorsByTag: IRavenObject<HiloIdGenerator>;
    protected readonly _store: DocumentStore;
    protected readonly _dbName: string;
    protected readonly _conventions: DocumentConventions;
    private _identityPartsSeparator;
    constructor(store: DocumentStore, dbName?: string);
    generateDocumentId(entity: object, documentType?: string): Promise<string>;
    private _maybeRefresh;
    generateNextIdFor(collectionName: string): Promise<number>;
    protected _createGeneratorFor(tag: string): HiloIdGenerator;
    returnUnusedRange(): Promise<void>;
    private static _returnUnusedRange;
}
