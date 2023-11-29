/// <reference types="node" />
import { IServerOperation, OperationResultType } from "../../../Documents/Operations/OperationAbstractions";
import { DocumentConventions } from "../../../Documents/Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
export declare class ReplaceClusterCertificateOperation implements IServerOperation<void> {
    private readonly _certBytes;
    private readonly _replaceImmediately;
    constructor(certBytes: Buffer, replaceImmediately: boolean);
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<void>;
}
