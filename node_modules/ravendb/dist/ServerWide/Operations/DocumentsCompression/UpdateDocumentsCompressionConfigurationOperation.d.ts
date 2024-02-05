import { IMaintenanceOperation, OperationResultType } from "../../../Documents/Operations/OperationAbstractions";
import { DocumentCompressionConfigurationResult } from "./DocumentCompressionConfigurationResult";
import { DocumentsCompressionConfiguration } from "../../DocumentsCompressionConfiguration";
import { RavenCommand } from "../../../Http/RavenCommand";
import { DocumentConventions } from "../../../Documents/Conventions/DocumentConventions";
export declare class UpdateDocumentsCompressionConfigurationOperation implements IMaintenanceOperation<DocumentCompressionConfigurationResult> {
    private readonly _documentsCompressionConfiguration;
    constructor(configuration: DocumentsCompressionConfiguration);
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<DocumentCompressionConfigurationResult>;
}
