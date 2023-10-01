export interface DateUtilOpts {
    withTimezone?: boolean;
    useUtcDates?: boolean;
}
export declare class DateUtil {
    private _opts;
    static DEFAULT_DATE_FORMAT: string;
    static DEFAULT_DATE_TZ_FORMAT: string;
    static default: DateUtil;
    static utc: DateUtil;
    constructor(_opts: DateUtilOpts);
    static timestamp(): number;
    static timestampMs(): number;
    static zeroDate(): Date;
    parse(dateString: string): Date;
    stringify(date: Date): string;
}
