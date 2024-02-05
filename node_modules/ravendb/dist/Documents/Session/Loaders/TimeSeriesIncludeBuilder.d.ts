import { IncludeBuilderBase } from "./IncludeBuilderBase";
import { ITimeSeriesIncludeBuilder } from "./ITimeSeriesIncludeBuilder";
export declare class TimeSeriesIncludeBuilder extends IncludeBuilderBase implements ITimeSeriesIncludeBuilder {
    includeTags(): ITimeSeriesIncludeBuilder;
    includeDocument(): ITimeSeriesIncludeBuilder;
}
