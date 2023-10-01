import { DatabaseAccess } from "./DatabaseAccess";
import { SecurityClearance } from "./SecurityClearance";
import { IServerOperation, OperationResultType } from "../../../Documents/Operations/OperationAbstractions";
import { DocumentConventions } from "../../../Documents/Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
export declare class PutClientCertificateOperation implements IServerOperation<void> {
    private readonly _certificate;
    private readonly _permissions;
    private readonly _name;
    private readonly _clearance;
    constructor(name: string, certificate: string, permissions: Record<string, DatabaseAccess>, clearance: SecurityClearance);
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<void>;
}
