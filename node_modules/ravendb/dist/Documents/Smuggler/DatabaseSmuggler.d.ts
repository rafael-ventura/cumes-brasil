/// <reference types="node" />
import { IDocumentStore } from "../IDocumentStore";
import { DatabaseSmugglerImportOptions } from "./DatabaseSmugglerImportOptions";
import { DatabaseSmugglerExportOptions } from "./DatabaseSmugglerExportOptions";
import { DatabaseSmugglerOptions } from "./DatabaseSmugglerOptions";
import { OperationCompletionAwaiter } from "../Operations/OperationCompletionAwaiter";
export declare class DatabaseSmuggler {
    private readonly _store;
    private readonly _databaseName;
    private readonly _requestExecutor;
    constructor(store: IDocumentStore);
    constructor(store: IDocumentStore, databaseName: string);
    forDatabase(databaseName: string): DatabaseSmuggler;
    export(options: DatabaseSmugglerExportOptions, toDatabase: DatabaseSmuggler): Promise<OperationCompletionAwaiter>;
    export(options: DatabaseSmugglerExportOptions, toFile: string): Promise<OperationCompletionAwaiter>;
    private _export;
    importIncremental(options: DatabaseSmugglerImportOptions, fromDirectory: string): Promise<void>;
    static configureOptionsFromIncrementalImport(options: DatabaseSmugglerOptions): import("./DatabaseItemType").DatabaseItemType[];
    import(options: DatabaseSmugglerImportOptions, fromFile: string): Promise<OperationCompletionAwaiter>;
    import(options: DatabaseSmugglerImportOptions, stream: NodeJS.ReadableStream): Promise<OperationCompletionAwaiter>;
    private _import;
}
