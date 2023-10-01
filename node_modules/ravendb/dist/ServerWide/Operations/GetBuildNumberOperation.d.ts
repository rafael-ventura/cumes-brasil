import { BuildNumber } from "./BuildNumber";
import { IServerOperation, OperationResultType } from "../../Documents/Operations/OperationAbstractions";
import { DocumentConventions } from "../../Documents/Conventions/DocumentConventions";
import { RavenCommand } from "../../Http/RavenCommand";
export declare class GetBuildNumberOperation implements IServerOperation<BuildNumber> {
    getCommand(conventions: DocumentConventions): RavenCommand<BuildNumber>;
    get resultType(): OperationResultType;
}
