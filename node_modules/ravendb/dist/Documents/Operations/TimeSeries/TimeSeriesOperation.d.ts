import { DocumentConventions } from "../../Conventions/DocumentConventions";
export declare class TimeSeriesOperation {
    private _appends;
    private _deletes;
    name: string;
    constructor();
    constructor(name: string);
    serialize(conventions: DocumentConventions): object;
    append(appendOperation: AppendOperation): void;
    delete(deleteOperation: DeleteOperation): void;
}
export declare class AppendOperation {
    timestamp: Date;
    values: number[];
    tag: string;
    constructor(timestamp: Date, values: number[]);
    constructor(timestamp: Date, values: number[], tag: string);
    serialize(conventions: DocumentConventions): object;
}
export declare class DeleteOperation {
    from: Date;
    to: Date;
    constructor();
    constructor(from: Date, to: Date);
    serialize(conventions: DocumentConventions): object;
}
