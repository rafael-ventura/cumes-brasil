export interface IEnumerableQuery<T extends object> {
    all(): Promise<T[]>;
}
