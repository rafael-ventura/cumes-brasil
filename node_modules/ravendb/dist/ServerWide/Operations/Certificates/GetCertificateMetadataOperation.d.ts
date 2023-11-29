import { CertificateMetadata } from "./CertificateMetadata";
import { IServerOperation, OperationResultType } from "../../../Documents/Operations/OperationAbstractions";
import { DocumentConventions } from "../../../Documents/Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
export declare class GetCertificateMetadataOperation implements IServerOperation<CertificateMetadata> {
    private readonly _thumbprint;
    constructor(thumbprint: string);
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<CertificateMetadata>;
}
