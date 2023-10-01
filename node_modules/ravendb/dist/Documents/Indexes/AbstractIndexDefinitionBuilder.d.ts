import { IndexConfiguration, IndexDefinition } from "./IndexDefinition";
import { FieldIndexing, FieldStorage, FieldTermVector, IndexLockMode, IndexPriority, IndexState } from "./Enums";
import { SpatialOptions } from "./Spatial";
import { DocumentConventions } from "../Conventions/DocumentConventions";
import { IndexDeploymentMode } from "./IndexDeploymentMode";
import { AdditionalAssembly } from "./AdditionalAssembly";
export declare abstract class AbstractIndexDefinitionBuilder<TIndexDefinition extends IndexDefinition> {
    protected readonly _indexName: string;
    reduce: string;
    storesStrings: {
        [key: string]: FieldStorage;
    };
    indexesStrings: {
        [key: string]: FieldIndexing;
    };
    analyzersStrings: {
        [key: string]: string;
    };
    suggestionsOptions: Set<string>;
    termVectorsStrings: {
        [key: string]: FieldTermVector;
    };
    spatialIndexesStrings: {
        [key: string]: SpatialOptions;
    };
    lockMode: IndexLockMode;
    priority: IndexPriority;
    state: IndexState;
    deploymentMode: IndexDeploymentMode;
    outputReduceToCollection: string;
    patternForOutputReduceToCollectionReferences: string;
    patternReferencesCollectionName: string;
    additionalSources: Record<string, string>;
    additionalAssemblies: AdditionalAssembly[];
    configuration: IndexConfiguration;
    protected constructor(indexName: string);
    toIndexDefinition(conventions: DocumentConventions, validateMap?: boolean): TIndexDefinition;
    protected abstract _newIndexDefinition(): TIndexDefinition;
    protected abstract _toIndexDefinition(indexDefinition: TIndexDefinition, conventions: DocumentConventions): any;
    private _applyValues;
}
