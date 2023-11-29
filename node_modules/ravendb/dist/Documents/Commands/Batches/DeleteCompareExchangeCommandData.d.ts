import { ICommandData, CommandType } from "../CommandData";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
export declare class DeleteCompareExchangeCommandData implements ICommandData {
    private readonly _index;
    id: string;
    changeVector: string;
    name: string;
    constructor(key: string, index: number);
    get type(): CommandType;
    serialize(conventions: DocumentConventions): object;
}
