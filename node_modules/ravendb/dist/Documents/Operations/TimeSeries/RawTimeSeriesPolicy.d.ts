import { TimeSeriesPolicy } from "./TimeSeriesPolicy";
import { TimeValue } from "../../../Primitives/TimeValue";
import { TimeSeriesPolicyRaw } from "./RawTimeSeriesTypes";
export declare class RawTimeSeriesPolicy extends TimeSeriesPolicy {
    static POLICY_STRING: string;
    static DEFAULT_POLICY: RawTimeSeriesPolicy;
    constructor();
    constructor(retentionTime: TimeValue);
    static parse(policy: TimeSeriesPolicyRaw): RawTimeSeriesPolicy;
}
