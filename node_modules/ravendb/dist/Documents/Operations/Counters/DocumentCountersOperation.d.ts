import { CounterOperation } from "./CounterOperation";
export declare class DocumentCountersOperation {
    operations: CounterOperation[];
    documentId: string;
    serialize(): object;
}
