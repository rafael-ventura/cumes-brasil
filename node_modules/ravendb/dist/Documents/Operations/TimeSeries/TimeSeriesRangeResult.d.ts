import { TimeSeriesEntry } from "../../Session/TimeSeries/TimeSeriesEntry";
export declare class TimeSeriesRangeResult {
    from: Date;
    to: Date;
    entries: TimeSeriesEntry[];
    totalResults: number;
    includes: any;
}
