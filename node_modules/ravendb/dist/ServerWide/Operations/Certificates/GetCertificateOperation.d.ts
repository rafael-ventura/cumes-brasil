import { CertificateDefinition } from "./CertificateDefinition";
import { IServerOperation, OperationResultType } from "../../../Documents/Operations/OperationAbstractions";
import { DocumentConventions } from "../../../Documents/Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
export declare class GetCertificateOperation implements IServerOperation<CertificateDefinition> {
    private readonly _thumbprint;
    constructor(thumbprint: string);
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<CertificateDefinition>;
}
