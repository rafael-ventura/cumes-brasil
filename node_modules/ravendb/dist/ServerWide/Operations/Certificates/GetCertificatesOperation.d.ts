import { CertificateDefinition } from "./CertificateDefinition";
import { IServerOperation, OperationResultType } from "../../../Documents/Operations/OperationAbstractions";
import { RavenCommand } from "../../../Http/RavenCommand";
import { DocumentConventions } from "../../../Documents/Conventions/DocumentConventions";
export declare class GetCertificatesOperation implements IServerOperation<CertificateDefinition[]> {
    private readonly _start;
    private readonly _pageSize;
    constructor(start: number, pageSize: number);
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<CertificateDefinition[]>;
}
