import { QueryToken } from "./QueryToken";
import { StringBuilder } from "../../../Utility/StringBuilder";
export declare class TimingsToken extends QueryToken {
    private constructor();
    static instance: TimingsToken;
    writeTo(writer: StringBuilder): void;
}
