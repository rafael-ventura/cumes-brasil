import { IRaftCommand } from "../../../Http/IRaftCommand";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { ICommandData } from "../CommandData";
import { BatchOptions } from "./BatchOptions";
import { SingleNodeBatchCommand } from "./SingleNodeBatchCommand";
export declare class ClusterWideBatchCommand extends SingleNodeBatchCommand implements IRaftCommand {
    private readonly _disableAtomicDocumentWrites;
    get disableAtomicDocumentWrites(): boolean;
    getRaftUniqueRequestId(): string;
    constructor(conventions: DocumentConventions, commands: ICommandData[], options?: BatchOptions, disableAtomicDocumentsWrites?: boolean);
    protected _appendOptions(): string;
}
