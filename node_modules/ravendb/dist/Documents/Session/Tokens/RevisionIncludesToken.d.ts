import { QueryToken } from "./QueryToken";
import { StringBuilder } from "../../../Utility/StringBuilder";
export declare class RevisionIncludesToken extends QueryToken {
    private readonly _dateTime;
    private readonly _path;
    private constructor();
    static createForDate(dateTime: Date): RevisionIncludesToken;
    static createForPath(path: string): RevisionIncludesToken;
    writeTo(writer: StringBuilder): void;
}
