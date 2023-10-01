import { InMemoryDocumentSessionOperations } from "./InMemoryDocumentSessionOperations";
import { IMetadataDictionary } from "./IMetadataDictionary";
import { IDocumentQueryCustomization } from "./IDocumentQueryCustomization";
import { DocumentType } from "../DocumentAbstractions";
import { Reference } from "../../Utility/Reference";
import { Topology } from "../../Http/Topology";
import { HttpRequestParameters, HttpResponse } from "../../Primitives/Http";
import { SessionDisposingEventArgs } from "../IDocumentStore";
export interface SessionEventsEmitter {
    on(eventName: "beforeStore", eventHandler: (eventArgs: SessionBeforeStoreEventArgs) => void): this;
    on(eventName: "afterSaveChanges", eventHandler: (eventArgs: SessionAfterSaveChangesEventArgs) => void): this;
    on(eventName: "beforeQuery", eventHandler: (eventArgs: SessionBeforeQueryEventArgs) => void): this;
    on(eventName: "beforeDelete", eventHandler: (eventArgs: SessionBeforeDeleteEventArgs) => void): this;
    on(eventName: "sessionDisposing", eventHandler: (eventArgs: SessionDisposingEventArgs) => void): this;
    removeListener(eventName: "beforeStore", eventHandler: (eventArgs: SessionBeforeStoreEventArgs) => void): this;
    removeListener(eventName: "afterSaveChanges", eventHandler: (eventArgs: SessionAfterSaveChangesEventArgs) => void): this;
    removeListener(eventName: "beforeQuery", eventHandler: (eventArgs: SessionBeforeQueryEventArgs) => void): this;
    removeListener(eventName: "beforeDelete", eventHandler: (eventArgs: SessionBeforeDeleteEventArgs) => void): this;
    removeListener(eventName: "sessionDisposing", eventHandler: (eventArgs: SessionDisposingEventArgs) => void): this;
    emit(eventName: "beforeStore", eventArgs: SessionBeforeStoreEventArgs): any;
    emit(eventName: "afterSaveChanges", eventArgs: SessionAfterSaveChangesEventArgs): any;
    emit(eventName: "beforeQuery", eventArgs: SessionBeforeQueryEventArgs): any;
    emit(eventName: "beforeDelete", eventArgs: SessionBeforeDeleteEventArgs): any;
    emit(eventName: "sessionDisposing", eventArgs: SessionDisposingEventArgs): any;
}
export declare class SessionBeforeStoreEventArgs {
    private _documentMetadata;
    private readonly _session;
    private readonly _documentId;
    private readonly _entity;
    constructor(session: InMemoryDocumentSessionOperations, documentId: string, entity: object);
    get session(): InMemoryDocumentSessionOperations;
    get documentId(): string;
    getEntity(): object;
    isMetadataAccessed(): boolean;
    getDocumentMetadata(): IMetadataDictionary;
}
export declare class SessionBeforeQueryEventArgs {
    session: InMemoryDocumentSessionOperations;
    queryCustomization: IDocumentQueryCustomization;
    constructor(session: InMemoryDocumentSessionOperations, queryCustomization: IDocumentQueryCustomization);
}
export declare class SessionBeforeDeleteEventArgs {
    private _documentMetadata;
    private readonly _session;
    private readonly _documentId;
    private readonly _entity;
    constructor(session: InMemoryDocumentSessionOperations, documentId: string, entity: object);
    get session(): InMemoryDocumentSessionOperations;
    get documentId(): string;
    get entity(): object;
    get documentMetadata(): IMetadataDictionary;
}
export declare class SessionAfterSaveChangesEventArgs {
    private _documentMetadata;
    session: InMemoryDocumentSessionOperations;
    documentId: string;
    entity: object;
    constructor(session: InMemoryDocumentSessionOperations, documentId: string, entity: object);
    get documentMetadata(): IMetadataDictionary;
}
export declare class AfterConversionToDocumentEventArgs {
    id: string;
    entity: object;
    document: Reference<object>;
    session: InMemoryDocumentSessionOperations;
    constructor(session: InMemoryDocumentSessionOperations, id: string, entity: object, document: Reference<object>);
}
export declare class AfterConversionToEntityEventArgs {
    id: string;
    document: object;
    entity: object;
    session: InMemoryDocumentSessionOperations;
    constructor(session: InMemoryDocumentSessionOperations, id: string, document: object, entity: object);
}
export declare class BeforeConversionToDocumentEventArgs {
    id: string;
    entity: object;
    session: InMemoryDocumentSessionOperations;
    constructor(session: InMemoryDocumentSessionOperations, id: string, entity: object);
}
export declare class BeforeConversionToEntityEventArgs {
    id: string;
    type: DocumentType;
    document: object;
    session: InMemoryDocumentSessionOperations;
    constructor(session: InMemoryDocumentSessionOperations, id: string, type: DocumentType, document: object);
}
export declare class FailedRequestEventArgs {
    database: string;
    url: string;
    error: Error;
    request: HttpRequestParameters;
    response: HttpResponse;
    constructor(database: string, url: string, error: Error, request: HttpRequestParameters, response: HttpResponse);
}
export declare class TopologyUpdatedEventArgs {
    topology: Topology;
    constructor(topology: Topology);
}
export declare class BeforeRequestEventArgs {
    database: string;
    url: string;
    request: HttpRequestParameters;
    attemptNumber: number;
    constructor(database: string, url: string, request: HttpRequestParameters, attemptNumber: number);
}
export declare class SucceedRequestEventArgs {
    database: string;
    url: string;
    response: HttpResponse;
    request: HttpRequestParameters;
    attemptNumber: number;
    constructor(database: string, url: string, response: HttpResponse, request: HttpRequestParameters, attemptNumber: number);
}
