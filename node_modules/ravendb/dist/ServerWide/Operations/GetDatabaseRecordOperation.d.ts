import { HttpRequestParameters } from "../../Primitives/Http";
import * as stream from "readable-stream";
import { IServerOperation, OperationResultType } from "../../Documents/Operations/OperationAbstractions";
import { DatabaseRecordWithEtag } from "..";
import { DocumentConventions } from "../../Documents/Conventions/DocumentConventions";
import { RavenCommand } from "../../Http/RavenCommand";
import { ServerNode } from "../../Http/ServerNode";
import { ServerResponse } from "../../Types";
import { RollingIndexDeployment } from "../../Documents/Indexes/RollingIndexDeployment";
import { DateUtil } from "../../Utility/DateUtil";
export declare class GetDatabaseRecordOperation implements IServerOperation<DatabaseRecordWithEtag> {
    private readonly _database;
    constructor(database: string);
    getCommand(conventions: DocumentConventions): RavenCommand<DatabaseRecordWithEtag>;
    get resultType(): OperationResultType;
}
export declare class GetDatabaseRecordCommand extends RavenCommand<DatabaseRecordWithEtag> {
    private readonly _conventions;
    private readonly _database;
    constructor(conventions: DocumentConventions, database: string);
    get isReadRequest(): boolean;
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
    static mapRollingDeployment(dateUtil: DateUtil, input: ServerResponse<Record<string, RollingIndexDeployment>>): Record<string, RollingIndexDeployment>;
}
