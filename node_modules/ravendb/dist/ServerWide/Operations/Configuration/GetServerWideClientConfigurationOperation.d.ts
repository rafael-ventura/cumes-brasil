import { RavenCommand } from "../../../Http/RavenCommand";
import { IServerOperation, OperationResultType } from "../../../Documents/Operations/OperationAbstractions";
import { ClientConfiguration } from "../../../Documents/Operations/Configuration/ClientConfiguration";
import { DocumentConventions } from "../../../Documents/Conventions/DocumentConventions";
export declare class GetServerWideClientConfigurationOperation implements IServerOperation<ClientConfiguration> {
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<ClientConfiguration>;
}
