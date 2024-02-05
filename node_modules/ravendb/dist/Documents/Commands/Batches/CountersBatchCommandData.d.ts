import { ICommandData, CommandType } from "../CommandData";
import { DocumentCountersOperation } from "../../Operations/Counters/DocumentCountersOperation";
import { CounterOperation } from "../../Operations/Counters/CounterOperation";
export declare class CountersBatchCommandData implements ICommandData {
    private _id;
    private _name;
    private _changeVector;
    private _fromEtl;
    private _counters;
    constructor(documentId: string, counterOperation: CounterOperation);
    constructor(documentId: string, counterOperations: CounterOperation[]);
    get id(): string;
    get name(): string;
    get changeVector(): string;
    get fromEtl(): boolean;
    get counters(): DocumentCountersOperation;
    get type(): CommandType;
    hasDelete(counterName: string): boolean;
    hasIncrement(counterName: string): boolean;
    private _hasOperationType;
    serialize(): object;
}
