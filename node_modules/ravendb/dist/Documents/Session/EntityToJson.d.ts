import { InMemoryDocumentSessionOperations } from "./InMemoryDocumentSessionOperations";
import { DocumentInfo } from "./DocumentInfo";
import { DocumentConventions } from "../Conventions/DocumentConventions";
import { DocumentType } from "../DocumentAbstractions";
import { TypesAwareObjectMapper } from "../../Mapping/ObjectMapper";
export declare class EntityToJson {
    private readonly _session;
    constructor(session: InMemoryDocumentSessionOperations);
    private _missingDictionary;
    get missingDictionary(): Map<object, Map<string, object>>;
    convertEntityToJson(entity: object, documentInfo: DocumentInfo): object;
    private static _convertEntityToJsonInternal;
    static convertEntityToJson(entity: object, conventions: DocumentConventions): object;
    static convertEntityToJson(entity: object, conventions: DocumentConventions, documentInfo: DocumentInfo, removeIdentityProperty: boolean): object;
    private static _writeMetadata;
    convertToEntity(targetEntityType: DocumentType, id: string, document: object, trackEntity: boolean): object;
    private static _getEntityTypeInfoFromMetadata;
    populateEntity(entity: object, id: string, document: object): void;
    static populateEntity(entity: object, document: object, objectMapper: TypesAwareObjectMapper): void;
    private static _tryRemoveIdentityProperty;
    static convertToEntity(entityClass: DocumentType, id: string, document: object, conventions: DocumentConventions): any;
    removeFromMissing(entity: object): void;
    clear(): void;
}
