import { IServerOperation, OperationResultType } from "../../Documents/Operations/OperationAbstractions";
import { DatabasePutResult } from "./index";
import { DatabaseRecord } from "../index";
import { DocumentConventions } from "../../Documents/Conventions/DocumentConventions";
import { RavenCommand } from "../../Http/RavenCommand";
export declare class UpdateDatabaseOperation implements IServerOperation<DatabasePutResult> {
    private readonly _databaseRecord;
    private readonly _etag;
    private readonly _replicationFactor;
    constructor(databaseRecord: DatabaseRecord, etag: number, replicationFactor?: number);
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<DatabasePutResult>;
}
