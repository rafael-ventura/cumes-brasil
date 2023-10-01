export interface IChangesObservable<T> extends IObservable<T> {
    ensureSubscribedNow(): Promise<void>;
}
export interface IObservable<T> {
    on(event: "data", handler: (value: T) => void): any;
    on(event: "error", handler: (error: Error) => void): any;
    off(event: "data", handler: (value: T) => void): any;
    off(event: "error", handler: (error: Error) => void): any;
    removeListener(event: "data", handler: (value: T) => void): any;
    removeListener(event: "error", handler: (error: Error) => void): any;
}
