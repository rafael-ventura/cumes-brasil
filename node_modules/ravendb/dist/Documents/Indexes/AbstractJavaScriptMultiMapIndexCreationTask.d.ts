import { IndexDefinition } from "./IndexDefinition";
import { IndexingMapDefinition, IndexingMapUtils, IndexingReduceDefinition } from "./StronglyTyped";
import { DocumentType } from "../DocumentAbstractions";
import { BaseJavaScriptIndexCreationTask } from "./BaseJavaScriptIndexCreationTask";
export declare class AbstractJavaScriptMultiMapIndexCreationTask<TMapResult extends object = any> extends BaseJavaScriptIndexCreationTask<keyof TMapResult & string> {
    private _maps;
    private _reduce;
    protected constructor();
    map<TDocument extends object>(collectionOrDocumentType: string | DocumentType<TDocument>, definition: IndexingMapDefinition<TDocument, TMapResult>): void;
    reduce(mapReduce: IndexingReduceDefinition<TMapResult>): void;
    addSource(name: string, source: Function): void;
    mapUtils(): IndexingMapUtils;
    get isMapReduce(): boolean;
    createIndexDefinition(): IndexDefinition;
}
