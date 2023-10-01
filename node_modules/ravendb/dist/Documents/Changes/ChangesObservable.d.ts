import { ChangesType, IChangesConnectionState } from "./IChangesConnectionState";
import { IChangesObservable } from "./IChangesObservable";
export declare class ChangesObservable<T, TConnectionState extends IChangesConnectionState<any>> implements IChangesObservable<T> {
    private readonly _type;
    private readonly _connectionState;
    private readonly _filter;
    private readonly _subscribers;
    private readonly _errorSubscribers;
    private _sendHandler;
    private _errorHandler;
    constructor(type: ChangesType, connectionState: TConnectionState, filter: (val: T) => boolean);
    on(event: "data", handler: (value: T) => void): any;
    on(event: "error", handler: (error: Error) => void): any;
    removeListener(event: "data", handler: (value: T) => void): any;
    removeListener(event: "error", handler: (error: Error) => void): any;
    off(event: "data", handler: (value: T) => void): any;
    off(event: "error", handler: (error: Error) => void): any;
    send(msg: T): void;
    error(e: Error): void;
    ensureSubscribedNow(): Promise<void>;
}
