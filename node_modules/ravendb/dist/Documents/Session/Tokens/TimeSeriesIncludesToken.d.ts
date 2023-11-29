import { QueryToken } from "./QueryToken";
import { StringBuilder } from "../../../Utility/StringBuilder";
import { AbstractTimeSeriesRange } from "../../Operations/TimeSeries/AbstractTimeSeriesRange";
export declare class TimeSeriesIncludesToken extends QueryToken {
    private _sourcePath;
    private readonly _range;
    private constructor();
    static create(sourcePath: string, range: AbstractTimeSeriesRange): TimeSeriesIncludesToken;
    addAliasToPath(alias: string): void;
    writeTo(writer: StringBuilder): void;
    private static _writeTimeRangeTo;
    private static _writeCountRangeTo;
    private static _writeRangeTo;
}
