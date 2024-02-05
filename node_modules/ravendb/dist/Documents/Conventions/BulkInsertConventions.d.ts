export declare class BulkInsertConventions {
    private readonly _notFrozen;
    private _timeSeriesBatchSize;
    constructor(notFrozen: () => void);
    get timeSeriesBatchSize(): number;
    set timeSeriesBatchSize(batchSize: number);
}
