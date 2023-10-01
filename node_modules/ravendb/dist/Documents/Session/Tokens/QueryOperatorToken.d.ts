import { QueryToken } from "./QueryToken";
export declare class QueryOperatorToken extends QueryToken {
    private readonly _queryOperator;
    private constructor();
    static AND: QueryOperatorToken;
    static OR: QueryOperatorToken;
    writeTo(writer: any): void;
}
