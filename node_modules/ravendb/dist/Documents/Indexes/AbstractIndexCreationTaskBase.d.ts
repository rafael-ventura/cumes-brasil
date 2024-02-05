import { DocumentConventions } from "../Conventions/DocumentConventions";
import { IndexDefinition } from "./IndexDefinition";
import { IndexPriority, IndexLockMode, IndexState } from "./Enums";
import { IDocumentStore } from "../IDocumentStore";
import { AbstractCommonApiForIndexes } from "./AbstractCommonApiForIndexes";
import { IAbstractIndexCreationTask } from "./IAbstractIndexCreationTask";
import { IndexDeploymentMode } from "./IndexDeploymentMode";
export declare abstract class AbstractIndexCreationTaskBase<TIndexDefinition extends IndexDefinition> extends AbstractCommonApiForIndexes implements IAbstractIndexCreationTask {
    abstract createIndexDefinition(): TIndexDefinition;
    conventions: DocumentConventions;
    priority: IndexPriority;
    lockMode: IndexLockMode;
    deploymentMode: IndexDeploymentMode;
    state: IndexState;
    execute(store: IDocumentStore): Promise<void>;
    execute(store: IDocumentStore, conventions: DocumentConventions): Promise<void>;
    execute(store: IDocumentStore, conventions: DocumentConventions, database: string): Promise<void>;
    private _putIndex;
}
