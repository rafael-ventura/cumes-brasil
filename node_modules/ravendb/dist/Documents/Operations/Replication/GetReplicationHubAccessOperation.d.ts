import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { DetailedReplicationHubAccess } from "./DetailedReplicationHubAccess";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
export declare class GetReplicationHubAccessOperation implements IMaintenanceOperation<DetailedReplicationHubAccess[]> {
    private readonly _hubName;
    private readonly _start;
    private readonly _pageSize;
    constructor(hubName: string, start?: number, pageSize?: number);
    getCommand(conventions: DocumentConventions): RavenCommand<DetailedReplicationHubAccess[]>;
    get resultType(): OperationResultType;
}
