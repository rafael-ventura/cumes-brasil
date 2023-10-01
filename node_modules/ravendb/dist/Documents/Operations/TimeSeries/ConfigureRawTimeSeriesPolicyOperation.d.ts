import { RawTimeSeriesPolicy } from "./RawTimeSeriesPolicy";
import { ConfigureTimeSeriesPolicyOperation } from "./ConfigureTimeSeriesPolicyOperation";
export declare class ConfigureRawTimeSeriesPolicyOperation extends ConfigureTimeSeriesPolicyOperation {
    constructor(collection: string, config: RawTimeSeriesPolicy);
}
