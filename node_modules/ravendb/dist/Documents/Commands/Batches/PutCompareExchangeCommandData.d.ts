import { ICommandData, CommandType } from "../CommandData";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
export declare class PutCompareExchangeCommandData implements ICommandData {
    private readonly _index;
    private readonly _document;
    id: string;
    changeVector: string;
    name: string;
    constructor(key: string, value: object, index: number);
    get type(): CommandType;
    serialize(conventions: DocumentConventions): object;
}
