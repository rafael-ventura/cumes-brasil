import { RavenCommand } from "../../../Http/RavenCommand";
import { DocumentConventions } from "../../../Documents/Conventions/DocumentConventions";
import { IServerOperation, OperationResultType } from "../../../Documents/Operations/OperationAbstractions";
import { ClientConfiguration } from "../../../Documents/Operations/Configuration/ClientConfiguration";
export declare class PutServerWideClientConfigurationOperation implements IServerOperation<void> {
    private readonly _configuration;
    constructor(configuration: ClientConfiguration);
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<void>;
}
