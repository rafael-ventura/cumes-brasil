import { SpatialOptions } from "./Spatial";
import { FieldStorage, FieldIndexing, FieldTermVector } from "./Enums";
export declare class IndexFieldOptions {
    storage: FieldStorage;
    indexing: FieldIndexing;
    termVector: FieldTermVector;
    spatial: SpatialOptions;
    analyzer: string;
    suggestions: boolean;
}
