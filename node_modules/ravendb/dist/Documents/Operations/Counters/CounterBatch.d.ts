import { DocumentCountersOperation } from "./DocumentCountersOperation";
export declare class CounterBatch {
    replyWithAllNodesValues: boolean;
    documents: DocumentCountersOperation[];
    fromEtl: boolean;
    serialize(): object;
}
