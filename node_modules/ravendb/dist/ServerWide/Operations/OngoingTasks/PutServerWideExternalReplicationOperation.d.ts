import { IServerOperation, OperationResultType } from "../../../Documents/Operations/OperationAbstractions";
import { ServerWideExternalReplicationResponse } from "./ServerWideTaskResponse";
import { ServerWideExternalReplication } from "./ServerWideExternalReplication";
import { DocumentConventions } from "../../../Documents/Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
export declare class PutServerWideExternalReplicationOperation implements IServerOperation<ServerWideExternalReplicationResponse> {
    private readonly _configuration;
    constructor(configuration: ServerWideExternalReplication);
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<ServerWideExternalReplicationResponse>;
}
