import { QueryToken } from "./Tokens/QueryToken";
import { StringBuilder } from "../../Utility/StringBuilder";
export declare class DocumentQueryHelper {
    static addSpaceIfNeeded(previousToken: QueryToken, currentToken: QueryToken, writer: StringBuilder): void;
}
