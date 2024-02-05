import { ISessionDocumentDeleteTimeSeriesBase } from "./ISessionDocumentDeleteTimeSeriesBase";
import { ISessionDocumentTypedAppendTimeSeriesBase } from "./ISessionDocumentTypedAppendTimeSeriesBase";
import { TypedTimeSeriesEntry } from "./TimeSeries/TypedTimeSeriesEntry";
export interface ISessionDocumentTypedTimeSeries<TValues extends object> extends ISessionDocumentTypedAppendTimeSeriesBase<TValues>, ISessionDocumentDeleteTimeSeriesBase {
    get(): Promise<TypedTimeSeriesEntry<TValues>[]>;
    get(from: Date, to: Date): Promise<TypedTimeSeriesEntry<TValues>[]>;
    get(from: Date, to: Date, start: number): Promise<TypedTimeSeriesEntry<TValues>[]>;
    get(from: Date, to: Date, start: number, pageSize: number): Promise<TypedTimeSeriesEntry<TValues>[]>;
}
