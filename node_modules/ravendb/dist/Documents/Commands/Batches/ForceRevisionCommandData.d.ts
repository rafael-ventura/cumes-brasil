import { CommandType, ICommandData } from "../CommandData";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
export declare class ForceRevisionCommandData implements ICommandData {
    id: string;
    name: string;
    changeVector: string;
    type: CommandType;
    constructor(id: string);
    serialize(conventions: DocumentConventions): object;
}
