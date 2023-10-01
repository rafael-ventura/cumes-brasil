import { DatabaseAccess } from "./DatabaseAccess";
import { SecurityClearance } from "./SecurityClearance";
import { IServerOperation, OperationResultType } from "../../../Documents/Operations/OperationAbstractions";
import { DocumentConventions } from "../../../Documents/Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
export declare class EditClientCertificateOperation implements IServerOperation<void> {
    private readonly _thumbprint;
    private readonly _permissions;
    private readonly _name;
    private readonly _clearance;
    constructor(parameters: EditClientCertificateParameters);
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<void>;
}
export interface EditClientCertificateParameters {
    thumbprint: string;
    permissions: Record<string, DatabaseAccess>;
    name: string;
    clearance: SecurityClearance;
}
