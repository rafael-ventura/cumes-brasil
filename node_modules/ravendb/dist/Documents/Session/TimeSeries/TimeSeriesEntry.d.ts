import { ClassConstructor } from "../../../Types";
import { TypedTimeSeriesEntry } from "./TypedTimeSeriesEntry";
export declare class TimeSeriesEntry {
    timestamp: Date;
    tag: string;
    values: number[];
    isRollup: boolean;
    get value(): number;
    set value(value: number);
    asTypedEntry<T extends object>(clazz: ClassConstructor<T>): TypedTimeSeriesEntry<T>;
}
