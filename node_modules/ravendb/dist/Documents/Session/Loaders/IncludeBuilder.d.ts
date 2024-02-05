import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { IncludeBuilderBase } from "./IncludeBuilderBase";
import { IIncludeBuilder } from "./IIncludeBuilder";
import { TimeSeriesRangeType } from "../../Operations/TimeSeries/TimeSeriesRangeType";
import { TimeValue } from "../../../Primitives/TimeValue";
export declare class IncludeBuilder extends IncludeBuilderBase implements IIncludeBuilder {
    constructor(conventions: DocumentConventions);
    includeDocuments(path: string): IIncludeBuilder;
    includeCounter(name: string): IIncludeBuilder;
    includeCounter(path: string, name: string): IIncludeBuilder;
    includeCounters(names: string[]): IIncludeBuilder;
    includeCounters(path: string, names: string[]): IIncludeBuilder;
    includeAllCounters(): IIncludeBuilder;
    includeTimeSeries(name: string): any;
    includeTimeSeries(name: string, from: Date, to: Date): any;
    includeTimeSeries(name: string, type: TimeSeriesRangeType, time: TimeValue): IIncludeBuilder;
    includeTimeSeries(name: string, type: TimeSeriesRangeType, count: number): IIncludeBuilder;
    includeTimeSeries(names: string[], type: TimeSeriesRangeType, time: TimeValue): IIncludeBuilder;
    includeTimeSeries(names: string[], type: TimeSeriesRangeType, count: number): IIncludeBuilder;
    includeCompareExchangeValue(path: string): this;
    includeAllTimeSeries(type: TimeSeriesRangeType, time: TimeValue): IIncludeBuilder;
    includeAllTimeSeries(type: TimeSeriesRangeType, count: number): IIncludeBuilder;
    includeRevisions(path: string): IIncludeBuilder;
    includeRevisions(before: Date): IIncludeBuilder;
}
