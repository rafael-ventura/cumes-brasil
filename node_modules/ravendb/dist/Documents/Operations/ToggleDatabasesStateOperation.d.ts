import { IServerOperation, OperationResultType } from "./OperationAbstractions";
import { DisableDatabaseToggleResult } from "./DisableDatabaseToggleResult";
import { DocumentConventions } from "../Conventions/DocumentConventions";
import { RavenCommand } from "../../Http/RavenCommand";
export declare class ToggleDatabasesStateOperation implements IServerOperation<DisableDatabaseToggleResult> {
    private readonly _disable;
    private readonly _parameters;
    constructor(databaseName: string, disable: boolean);
    constructor(databaseNames: string[], disable: boolean);
    constructor(parameters: ToggleDatabasesStateParameters, disable: boolean);
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<DisableDatabaseToggleResult>;
}
export interface ToggleDatabasesStateParameters {
    databaseNames: string[];
}
