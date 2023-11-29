export interface ISessionDocumentAppendTimeSeriesBase {
    append(timestamp: Date, values: number[]): void;
    append(timestamp: Date, values: number[], tag: string): void;
    append(timestamp: Date, value: number): void;
    append(timestamp: Date, value: number, tag: string): void;
}
