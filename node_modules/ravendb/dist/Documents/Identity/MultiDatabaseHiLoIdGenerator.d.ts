import { MultiTypeHiLoIdGenerator } from "./MultiTypeHiLoIdGenerator";
import { DocumentStore } from "../DocumentStore";
import { IHiLoIdGenerator } from "./IHiLoIdGenerator";
import { ObjectTypeDescriptor } from "../../Types";
export declare class MultiDatabaseHiLoIdGenerator implements IHiLoIdGenerator {
    protected readonly _store: DocumentStore;
    private _generators;
    constructor(store: DocumentStore);
    generateDocumentId(database: string, entity: object): Promise<string>;
    protected _getGeneratorForDatabase(database: string): MultiTypeHiLoIdGenerator;
    returnUnusedRange(): Promise<void>;
    generateNextIdFor(database: string, collectionName: string): Promise<number>;
    generateNextIdFor(database: string, documentType: ObjectTypeDescriptor<any>): Promise<number>;
    generateNextIdFor(database: string, entity: object): Promise<number>;
    private _generateNextIdFor;
}
