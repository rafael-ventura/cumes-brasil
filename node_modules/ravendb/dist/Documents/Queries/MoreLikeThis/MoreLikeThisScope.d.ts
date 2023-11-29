import { IDisposable } from "../../../Types/Contracts";
import { MoreLikeThisToken } from "../../Session/Tokens/MoreLikeThisToken";
import { MoreLikeThisOptions } from "./MoreLikeThisOptions";
export declare class MoreLikeThisScope implements IDisposable {
    private readonly _token;
    private readonly _addQueryParameter;
    private readonly _onDispose;
    constructor(token: MoreLikeThisToken, addQueryParameter: (value: any) => string, onDispose: () => void);
    dispose(): void;
    withOptions(options: MoreLikeThisOptions): void;
    withDocument(document: string): void;
}
