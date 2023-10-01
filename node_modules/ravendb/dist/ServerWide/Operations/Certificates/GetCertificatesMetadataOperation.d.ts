import { CertificateMetadata } from "./CertificateMetadata";
import { IServerOperation, OperationResultType } from "../../../Documents/Operations/OperationAbstractions";
import { DocumentConventions } from "../../../Documents/Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
export declare class GetCertificatesMetadataOperation implements IServerOperation<CertificateMetadata[]> {
    private readonly _name;
    constructor();
    constructor(name: string);
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<CertificateMetadata[]>;
}
