import { ICommandData } from "../Commands/CommandData";
import { InMemoryDocumentSessionOperations } from "./InMemoryDocumentSessionOperations";
import { RequestExecutor } from "../../Http/RequestExecutor";
import { SessionInfo } from "./IDocumentSession";
import { IDocumentStore } from "../IDocumentStore";
import { DocumentsById } from "./DocumentsById";
export declare abstract class AdvancedSessionExtensionBase {
    protected _session: InMemoryDocumentSessionOperations;
    protected _requestExecutor: RequestExecutor;
    protected _sessionInfo: SessionInfo;
    protected _documentStore: IDocumentStore;
    protected _deferredCommandsMap: Map<string, ICommandData>;
    protected _documentsById: DocumentsById;
    protected constructor(session: InMemoryDocumentSessionOperations);
    defer(command: ICommandData, ...commands: ICommandData[]): void;
}
