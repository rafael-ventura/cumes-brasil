import { Lazy } from "../Lazy";
export interface IDocumentQueryBaseSingle<T extends object> {
    first(): Promise<T>;
    firstOrNull(): Promise<T | null>;
    single(): Promise<T>;
    singleOrNull(): Promise<T | null>;
    count(): Promise<number>;
    longCount(): Promise<number>;
    lazily(): Lazy<T[]>;
    lazily(onEval: (list: T[]) => void): Lazy<T[]>;
    any(): Promise<boolean>;
    countLazily(): Lazy<number>;
}
