import { DocumentInfo } from "../Documents/Session/DocumentInfo";
import { DocumentsChanges } from "../Documents/Session/DocumentsChanges";
export declare class JsonOperation {
    static entityChanged(newObj: object, documentInfo: DocumentInfo, changes: {
        [id: string]: DocumentsChanges[];
    }): boolean;
    private static _fieldPathCombine;
    private static _compareJson;
    private static _compareValues;
    private static _compareJsonArray;
    private static _addIndexFieldPath;
    private static _newChange;
}
