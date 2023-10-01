import { IDatabaseChanges } from "./IDatabaseChanges";
import { IDisposable } from "../../Types/Contracts";
export interface IConnectableChanges<T extends IDatabaseChanges> extends IDisposable {
    connected: boolean;
    ensureConnectedNow(): Promise<IDatabaseChanges>;
    on(type: "connectionStatus", handler: () => void): any;
    on(type: "error", handler: (error: Error) => void): any;
    off(type: "connectionStatus", handler: () => void): any;
    off(type: "error", handler: (error: Error) => void): any;
}
