import { ISessionDocumentDeleteTimeSeriesBase } from "./ISessionDocumentDeleteTimeSeriesBase";
import { ISessionDocumentAppendTimeSeriesBase } from "./ISessionDocumentAppendTimeSeriesBase";
import { TimeSeriesEntry } from "./TimeSeries/TimeSeriesEntry";
import { ITimeSeriesIncludeBuilder } from "./Loaders/ITimeSeriesIncludeBuilder";
export interface ISessionDocumentTimeSeries extends ISessionDocumentAppendTimeSeriesBase, ISessionDocumentDeleteTimeSeriesBase {
    get(): Promise<TimeSeriesEntry[]>;
    get(start: number, pageSize: number): Promise<TimeSeriesEntry[]>;
    get(from: Date, to: Date): Promise<TimeSeriesEntry[]>;
    get(from: Date, to: Date, start: number): Promise<TimeSeriesEntry[]>;
    get(from: Date, to: Date, start: number, pageSize: number): Promise<TimeSeriesEntry[]>;
    get(from: Date, to: Date, includes: (includeBuilder: ITimeSeriesIncludeBuilder) => void): Promise<TimeSeriesEntry[]>;
    get(from: Date, to: Date, includes: (includeBuilder: ITimeSeriesIncludeBuilder) => void, start: number): Promise<TimeSeriesEntry[]>;
    get(from: Date, to: Date, includes: (includeBuilder: ITimeSeriesIncludeBuilder) => void, start: number, pageSize: number): Promise<TimeSeriesEntry[]>;
}
