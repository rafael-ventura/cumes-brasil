import { InMemoryDocumentSessionOperations } from "../InMemoryDocumentSessionOperations";
import { GetRequest } from "../../Commands/MultiGet/GetRequest";
import { MultiGetCommand } from "../../Commands/MultiGet/MultiGetCommand";
export declare class MultiGetOperation {
    private readonly _session;
    constructor(session: InMemoryDocumentSessionOperations);
    createRequest(requests: GetRequest[]): MultiGetCommand;
    setResult(result: object): void;
}
