import { PatchStatus } from "./PatchStatus";
export declare class PatchResult {
    status: PatchStatus;
    modifiedDocument: object;
    originalDocument: object;
    debug: object;
    changeVector: string;
    collection: string;
    lastModified: Date;
}
