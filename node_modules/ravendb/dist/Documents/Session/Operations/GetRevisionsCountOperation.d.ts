import { RavenCommand } from "../../../Http/RavenCommand";
export declare class GetRevisionsCountOperation {
    private readonly _docId;
    constructor(docId: string);
    createRequest(): RavenCommand<number>;
}
