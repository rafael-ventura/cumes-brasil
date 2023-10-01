import { AbstractIndexCreationTaskBase } from "../AbstractIndexCreationTaskBase";
import { FieldIndexing, FieldStorage, FieldTermVector } from "../Enums";
import { SpatialOptions, SpatialOptionsFactory } from "../Spatial";
import { CountersIndexDefinition } from "./CountersIndexDefinition";
export declare abstract class AbstractGenericCountersIndexCreationTask extends AbstractIndexCreationTaskBase<CountersIndexDefinition> {
    protected _reduce: string;
    protected _storesStrings: Record<string, FieldStorage>;
    protected _indexesStrings: Record<string, FieldIndexing>;
    protected _analyzersStrings: Record<string, string>;
    protected _indexSuggestions: Set<string>;
    protected _termVectorsStrings: Record<string, FieldTermVector>;
    protected _spatialOptionsStrings: Record<string, SpatialOptions>;
    protected _outputReduceToCollection: string;
    protected _patternForOutputReduceToCollectionReferences: string;
    protected _patternReferencesCollectionName: string;
    constructor();
    get isMapReduce(): boolean;
    protected index(field: string, indexing: FieldIndexing): void;
    protected spatial(field: string, indexing: (spatialOptsFactory: SpatialOptionsFactory) => SpatialOptions): void;
    protected storeAllFields(storage: FieldStorage): void;
    protected store(field: string, storage: FieldStorage): void;
    protected analyze(field: string, analyzer: string): void;
    protected termVector(field: string, termVector: FieldTermVector): void;
    protected suggestion(field: string): void;
}
