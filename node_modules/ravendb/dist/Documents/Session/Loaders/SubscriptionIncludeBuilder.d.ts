import { IncludeBuilderBase } from "./IncludeBuilderBase";
import { ISubscriptionIncludeBuilder } from "./ISubscriptionIncludeBuilder";
import { TimeSeriesRangeType } from "../../Operations/TimeSeries/TimeSeriesRangeType";
import { TimeValue } from "../../../Primitives/TimeValue";
export declare class SubscriptionIncludeBuilder extends IncludeBuilderBase implements ISubscriptionIncludeBuilder {
    includeDocuments(path: string): ISubscriptionIncludeBuilder;
    includeCounter(name: string): ISubscriptionIncludeBuilder;
    includeCounters(names: string[]): ISubscriptionIncludeBuilder;
    includeAllCounters(): ISubscriptionIncludeBuilder;
    includeTimeSeries(name: string, type: TimeSeriesRangeType, time: TimeValue): ISubscriptionIncludeBuilder;
    includeTimeSeries(name: string, type: TimeSeriesRangeType, count: number): ISubscriptionIncludeBuilder;
    includeTimeSeries(names: string[], type: TimeSeriesRangeType, time: TimeValue): ISubscriptionIncludeBuilder;
    includeTimeSeries(names: string[], type: TimeSeriesRangeType, count: number): ISubscriptionIncludeBuilder;
    includeAllTimeSeries(type: TimeSeriesRangeType, time: TimeValue): ISubscriptionIncludeBuilder;
    includeAllTimeSeries(type: TimeSeriesRangeType, count: number): ISubscriptionIncludeBuilder;
}
