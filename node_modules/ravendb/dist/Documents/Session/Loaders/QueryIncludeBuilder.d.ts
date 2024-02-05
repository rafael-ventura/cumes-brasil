import { IncludeBuilderBase } from "./IncludeBuilderBase";
import { IQueryIncludeBuilder } from "./IQueryIncludeBuilder";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { TimeSeriesRangeType } from "../../Operations/TimeSeries/TimeSeriesRangeType";
import { TimeValue } from "../../../Primitives/TimeValue";
export declare class QueryIncludeBuilder extends IncludeBuilderBase implements IQueryIncludeBuilder {
    constructor(conventions: DocumentConventions);
    includeCounter(name: string): IQueryIncludeBuilder;
    includeCounter(path: string, name: string): IQueryIncludeBuilder;
    includeCounters(names: string[]): IQueryIncludeBuilder;
    includeCounters(path: string, names: string[]): IQueryIncludeBuilder;
    includeAllCounters(): IQueryIncludeBuilder;
    includeAllCounters(path: string): IQueryIncludeBuilder;
    includeDocuments(path: string): IQueryIncludeBuilder;
    includeTimeSeries(name: string): IQueryIncludeBuilder;
    includeTimeSeries(name: string, from: Date, to: Date): IQueryIncludeBuilder;
    includeTimeSeries(path: string, name: string): IQueryIncludeBuilder;
    includeTimeSeries(path: string, name: string, from: Date, to: Date): IQueryIncludeBuilder;
    includeTimeSeries(name: string, type: TimeSeriesRangeType, time: TimeValue): IQueryIncludeBuilder;
    includeTimeSeries(name: string, type: TimeSeriesRangeType, count: number): IQueryIncludeBuilder;
    includeTimeSeries(names: string[], type: TimeSeriesRangeType, time: TimeValue): IQueryIncludeBuilder;
    includeTimeSeries(names: string[], type: TimeSeriesRangeType, count: number): IQueryIncludeBuilder;
    includeCompareExchangeValue(path: string): IQueryIncludeBuilder;
    includeAllTimeSeries(type: TimeSeriesRangeType, time: TimeValue): IQueryIncludeBuilder;
    includeAllTimeSeries(type: TimeSeriesRangeType, count: number): IQueryIncludeBuilder;
    includeRevisions(path: string): IQueryIncludeBuilder;
    includeRevisions(before: Date): IQueryIncludeBuilder;
}
