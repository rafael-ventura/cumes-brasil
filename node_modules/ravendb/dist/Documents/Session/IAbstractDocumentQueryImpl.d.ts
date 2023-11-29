import { FieldsToFetchToken } from "./Tokens/FieldsToFetchToken";
import { QueryOperation } from "./Operations/QueryOperation";
export interface IAbstractDocumentQueryImpl<T> {
    fieldsToFetchToken: FieldsToFetchToken;
    isProjectInto: boolean;
    initializeQueryOperation(): QueryOperation;
}
