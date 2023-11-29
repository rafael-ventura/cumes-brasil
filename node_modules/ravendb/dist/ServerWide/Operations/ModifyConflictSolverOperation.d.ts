import { IServerOperation, OperationResultType } from "../../Documents/Operations/OperationAbstractions";
import { ConflictSolver, ScriptResolver } from "../index";
import { DocumentConventions } from "../../Documents/Conventions/DocumentConventions";
import { RavenCommand } from "../../Http/RavenCommand";
export declare class ModifyConflictSolverOperation implements IServerOperation<ModifySolverResult> {
    private readonly _database;
    private readonly _collectionByScript;
    private readonly _resolveToLatest;
    constructor(database: string);
    constructor(database: string, collectionByScript: Record<string, ScriptResolver>);
    constructor(database: string, collectionByScript: Record<string, ScriptResolver>, resolveToLatest: boolean);
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<ModifySolverResult>;
}
export interface ModifySolverResult {
    key: string;
    raftCommandIndex: number;
    solver: ConflictSolver;
}
