import { TimeValue } from "../../../Primitives/TimeValue";
import { TimeSeriesPolicyRaw } from "./RawTimeSeriesTypes";
export declare class TimeSeriesPolicy {
    name: string;
    retentionTime: TimeValue;
    aggregationTime: TimeValue;
    getTimeSeriesName(rawName: string): string;
    constructor(name: string, aggregationTime: TimeValue);
    constructor(name: string, aggregationTime: TimeValue, retentionTime: TimeValue);
    serialize(): TimeSeriesPolicyRaw;
    static parse(policy: TimeSeriesPolicyRaw): TimeSeriesPolicy;
}
