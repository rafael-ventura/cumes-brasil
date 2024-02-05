import { ForceRevisionStrategy } from "./ForceRevisionStrategy";
import { AdvancedSessionExtensionBase } from "./AdvancedSessionExtensionBase";
export declare class DocumentSessionRevisionsBase extends AdvancedSessionExtensionBase {
    forceRevisionCreationFor<T extends object>(entity: T): any;
    forceRevisionCreationFor<T extends object>(entity: T, strategy: ForceRevisionStrategy): any;
    forceRevisionCreationFor<T extends object>(id: string): any;
    forceRevisionCreationFor<T extends object>(id: string, strategy: ForceRevisionStrategy): any;
    private _addIdToList;
}
