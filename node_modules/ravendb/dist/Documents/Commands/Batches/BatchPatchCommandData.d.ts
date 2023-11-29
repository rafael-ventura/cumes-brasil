import { CommandType, ICommandData } from "../CommandData";
import { PatchRequest } from "../../Operations/PatchRequest";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
export interface IdAndChangeVector {
    id: string;
    changeVector: string;
}
export declare class BatchPatchCommandData implements ICommandData {
    private readonly _seenIds;
    private readonly _ids;
    private _name;
    private _patch;
    private _patchIfMissing;
    constructor(patch: PatchRequest, patchIfMissing: PatchRequest, ...ids: string[]);
    constructor(patch: PatchRequest, patchIfMissing: PatchRequest, ...ids: IdAndChangeVector[]);
    private _add;
    get ids(): IdAndChangeVector[];
    get id(): string;
    get name(): string;
    get patch(): PatchRequest;
    patchIfMissing(): PatchRequest;
    get changeVector(): string;
    get type(): CommandType;
    serialize(conventions: DocumentConventions): object;
}
