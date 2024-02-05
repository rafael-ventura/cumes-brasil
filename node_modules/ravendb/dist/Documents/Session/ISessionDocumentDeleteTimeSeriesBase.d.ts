export interface ISessionDocumentDeleteTimeSeriesBase {
    delete(): void;
    delete(from: Date, to: Date): void;
    deleteAt(at: Date): void;
}
