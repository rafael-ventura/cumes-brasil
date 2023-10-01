import { IServerOperation, OperationResultType } from "../../../Documents/Operations/OperationAbstractions";
import { ServerWideExternalReplication } from "./ServerWideExternalReplication";
import { DocumentConventions } from "../../../Documents/Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
export declare class GetServerWideExternalReplicationOperation implements IServerOperation<ServerWideExternalReplication> {
    private readonly _name;
    constructor(name: string);
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<ServerWideExternalReplication>;
}
