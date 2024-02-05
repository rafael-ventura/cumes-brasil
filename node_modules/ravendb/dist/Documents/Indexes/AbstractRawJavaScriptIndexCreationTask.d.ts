import { IndexDefinition } from "./IndexDefinition";
import { AbstractIndexCreationTaskBase } from "./AbstractIndexCreationTaskBase";
export declare class AbstractRawJavaScriptIndexCreationTask extends AbstractIndexCreationTaskBase<IndexDefinition> {
    private readonly _definition;
    protected constructor();
    get maps(): Set<string>;
    set maps(value: Set<string>);
    get fields(): {
        [fieldName: string]: import("./IndexFieldOptions").IndexFieldOptions;
    };
    set fields(value: {
        [fieldName: string]: import("./IndexFieldOptions").IndexFieldOptions;
    });
    get reduce(): string;
    set reduce(value: string);
    get isMapReduce(): boolean;
    get outputReduceToCollection(): string;
    set outputReduceToCollection(value: string);
    get patternReferencesCollectionName(): string;
    set patternReferencesCollectionName(value: string);
    get patternForOutputReduceToCollectionReferences(): string;
    set patternForOutputReduceToCollectionReferences(value: string);
    createIndexDefinition(): IndexDefinition;
}
