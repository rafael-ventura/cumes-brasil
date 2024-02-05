import { ObjectTypeDescriptor } from "../../Types";
import { DocumentChange } from "./DocumentChange";
import { OperationStatusChange } from "./OperationStatusChange";
import { IndexChange } from "./IndexChange";
import { IChangesObservable } from "./IChangesObservable";
import { IConnectableChanges } from "./IConnectableChanges";
import { CounterChange } from "./CounterChange";
import { TimeSeriesChange } from "./TimeSeriesChange";
export interface IDatabaseChanges extends IConnectableChanges<IDatabaseChanges> {
    forIndex(indexName: string): IChangesObservable<IndexChange>;
    forDocument(docId: string): IChangesObservable<DocumentChange>;
    forAllDocuments(): IChangesObservable<DocumentChange>;
    forOperationId(operationId: number): IChangesObservable<OperationStatusChange>;
    forAllOperations(): IChangesObservable<OperationStatusChange>;
    forAllIndexes(): IChangesObservable<IndexChange>;
    forDocumentsStartingWith(docIdPrefix: string): IChangesObservable<DocumentChange>;
    forDocumentsInCollection(collectionName: string): IChangesObservable<DocumentChange>;
    forDocumentsInCollection<T extends object>(type: ObjectTypeDescriptor<T>): IChangesObservable<DocumentChange>;
    forAllCounters(): IChangesObservable<CounterChange>;
    forCounter(counterName: string): IChangesObservable<CounterChange>;
    forCounterOfDocument(documentId: string, counterName: string): IChangesObservable<CounterChange>;
    forCountersOfDocument(documentId: string): IChangesObservable<CounterChange>;
    forAllTimeSeries(): IChangesObservable<TimeSeriesChange>;
    forTimeSeries(timeSeriesName: string): IChangesObservable<TimeSeriesChange>;
    forTimeSeriesOfDocument(documentId: string, timeSeriesName: string): IChangesObservable<TimeSeriesChange>;
    forTimeSeriesOfDocument(documentId: any): IChangesObservable<TimeSeriesChange>;
}
