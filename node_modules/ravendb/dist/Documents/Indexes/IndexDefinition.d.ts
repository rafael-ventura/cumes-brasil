import { IndexLockMode, IndexType } from "./Enums";
import { IndexFieldOptions } from "./IndexFieldOptions";
import { DocumentConventions } from "../Conventions/DocumentConventions";
import { AbstractIndexDefinitionBuilder } from "./AbstractIndexDefinitionBuilder";
import { IndexSourceType } from "./IndexSourceType";
import { AdditionalAssembly } from "./AdditionalAssembly";
import { IndexDeploymentMode } from "./IndexDeploymentMode";
import { IndexDefinitionBase } from "./IndexDefinitionBase";
export interface IndexConfiguration {
    [key: string]: string;
}
export declare class IndexDefinition extends IndexDefinitionBase {
    lockMode: IndexLockMode;
    indexType: IndexType;
    additionalSources: {
        [key: string]: string;
    };
    additionalAssemblies: AdditionalAssembly[];
    maps: Set<string>;
    reduce: string;
    fields: {
        [fieldName: string]: IndexFieldOptions;
    };
    private _indexSourceType;
    configuration: IndexConfiguration;
    outputReduceToCollection: string;
    reduceOutputIndex: number;
    patternForOutputReduceToCollectionReferences: string;
    patternReferencesCollectionName: string;
    deploymentMode: IndexDeploymentMode;
    toString(): string;
    detectStaticIndexSourceType(): IndexSourceType;
    get sourceType(): IndexSourceType;
    set sourceType(value: IndexSourceType);
    get type(): IndexType;
    set type(indexType: IndexType);
    detectStaticIndexType(): IndexType;
}
export declare class IndexDefinitionBuilder extends AbstractIndexDefinitionBuilder<IndexDefinition> {
    map: string;
    constructor(indexName?: string);
    protected _newIndexDefinition(): IndexDefinition;
    toIndexDefinition(conventions: DocumentConventions, validateMap?: boolean): IndexDefinition;
    protected _toIndexDefinition(indexDefinition: IndexDefinition, conventions: DocumentConventions): void;
}
