import { TimeSeriesCollectionConfiguration } from "./TimeSeriesCollectionConfiguration";
import { TimeSeriesCollectionConfigurationRaw } from "./RawTimeSeriesTypes";
export declare class TimeSeriesConfiguration {
    collections: Map<string, TimeSeriesCollectionConfiguration>;
    policyCheckFrequencyInMs: number;
    namedValues: Map<string, Map<string, string[]>>;
    getNames(collection: string, timeSeries: string): string[];
    serialize(): TimeSeriesConfigurationRaw;
    static parse(raw: TimeSeriesConfigurationRaw): TimeSeriesConfiguration;
}
export interface TimeSeriesConfigurationRaw {
    Collections: Record<string, TimeSeriesCollectionConfigurationRaw>;
    PolicyCheckFrequency: string;
    NamedValues: Record<string, Record<string, string[]>>;
}
