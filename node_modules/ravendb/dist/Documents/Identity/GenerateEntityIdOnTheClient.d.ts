import { DocumentConventions } from "../Conventions/DocumentConventions";
export declare class GenerateEntityIdOnTheClient {
    private _conventions;
    private _generateId;
    constructor(conventions: DocumentConventions, generateId: (obj: object) => Promise<string>);
    private _getIdentityProperty;
    tryGetIdFromInstance(entity: object, idCallback?: (id: string) => void): boolean;
    getOrGenerateDocumentId(entity: object): Promise<string>;
    generateDocumentKeyForStorage(entity: object): Promise<string>;
    trySetIdentity(entity: object, id: string, isProjection?: boolean): void;
}
