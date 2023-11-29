import { CertificateRawData } from "./CertificateRawData";
import { DatabaseAccess } from "./DatabaseAccess";
import { SecurityClearance } from "./SecurityClearance";
import { IServerOperation, OperationResultType } from "../../../Documents/Operations/OperationAbstractions";
import { DocumentConventions } from "../../../Documents/Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
export declare class CreateClientCertificateOperation implements IServerOperation<CertificateRawData> {
    private readonly _name;
    private readonly _permissions;
    private readonly _clearance;
    private readonly _password;
    constructor(name: string, permissions: Record<string, DatabaseAccess>, clearance: SecurityClearance, password?: string);
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<CertificateRawData>;
}
