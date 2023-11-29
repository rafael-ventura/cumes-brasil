import { IDocumentStore } from "../IDocumentStore";
import { DocumentConventions } from "../Conventions/DocumentConventions";
import { IndexDefinition } from "./IndexDefinition";
import { IAbstractIndexCreationTask } from "./IAbstractIndexCreationTask";
export declare class IndexCreation {
    static createIndexes(indexes: IAbstractIndexCreationTask[], store: IDocumentStore): Promise<void>;
    static createIndexes(indexes: IAbstractIndexCreationTask[], store: IDocumentStore, conventions: DocumentConventions): Promise<void>;
    static createIndexesToAdd(indexCreationTasks: IAbstractIndexCreationTask[], conventions: DocumentConventions): IndexDefinition[];
}
