import { DatabaseChange } from "./DatabaseChange";
import { ChangesType, IChangesConnectionState } from "./IChangesConnectionState";
export declare class DatabaseConnectionState implements IChangesConnectionState<DatabaseChange> {
    private static readonly ERROR_EVENT;
    private _emitter;
    addOnError(handler: (value: Error) => void): void;
    removeOnError(handler: (value: Error) => void): void;
    private readonly _onDisconnect;
    readonly onConnect: () => Promise<void>;
    private _value;
    lastError: Error;
    private readonly _firstSet;
    private _connected;
    set(connection: Promise<void>): void;
    inc(): void;
    dec(): void;
    error(e: Error): void;
    ensureSubscribedNow(): Promise<void>;
    dispose(): void;
    constructor(onConnect: () => Promise<void>, onDisconnect: () => Promise<void>);
    addOnChangeNotification(type: ChangesType, handler: (change: DatabaseChange) => void): void;
    removeOnChangeNotification(type: ChangesType, handler: (change: DatabaseChange) => void): void;
    send(type: ChangesType, change: DatabaseChange): void;
}
