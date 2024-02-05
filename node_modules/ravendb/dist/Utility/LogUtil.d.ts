export interface ILogger {
    info(msg: string): any;
    error(errOrMsg: string | Error, additionalMsg?: string): any;
    warn(errOrMsg: string | Error, additionalMsg?: string): any;
}
export declare function getLogger({ name, module }: {
    name?: string;
    module?: string;
}): ILogger;
