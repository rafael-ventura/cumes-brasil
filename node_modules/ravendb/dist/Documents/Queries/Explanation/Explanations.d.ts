import { QueryResult } from "../QueryResult";
export declare class Explanations {
    private _explanations;
    get explanations(): {
        [key: string]: string[];
    };
    set explanations(value: {
        [key: string]: string[];
    });
    update(queryResult: QueryResult): void;
}
