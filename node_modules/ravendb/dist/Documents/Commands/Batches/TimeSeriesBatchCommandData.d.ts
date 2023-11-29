import { CommandType, ICommandData } from "../CommandData";
import { AppendOperation, DeleteOperation, TimeSeriesOperation } from "../../Operations/TimeSeries/TimeSeriesOperation";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { InMemoryDocumentSessionOperations } from "../../Session/InMemoryDocumentSessionOperations";
export declare class TimeSeriesBatchCommandData implements ICommandData {
    private _id;
    private _name;
    private _timeSeries;
    constructor(documentId: string, name: string, appends: AppendOperation[], deletes: DeleteOperation[]);
    get id(): string;
    set id(value: string);
    get name(): string;
    set name(value: string);
    get changeVector(): any;
    get type(): CommandType;
    get timeSeries(): TimeSeriesOperation;
    serialize(conventions: DocumentConventions): object;
    onBeforeSaveChanges(session: InMemoryDocumentSessionOperations): void;
}
