import { TimeSeriesPolicy } from "./TimeSeriesPolicy";
import { RawTimeSeriesPolicy } from "./RawTimeSeriesPolicy";
import { TimeSeriesCollectionConfigurationRaw } from "./RawTimeSeriesTypes";
export declare class TimeSeriesCollectionConfiguration {
    disabled: boolean;
    policies: TimeSeriesPolicy[];
    rawPolicy: RawTimeSeriesPolicy;
    static isRaw(policy: TimeSeriesPolicy): boolean;
    serialize(): TimeSeriesCollectionConfigurationRaw;
    static parse(collectionRaw: TimeSeriesCollectionConfigurationRaw): TimeSeriesCollectionConfiguration;
}
