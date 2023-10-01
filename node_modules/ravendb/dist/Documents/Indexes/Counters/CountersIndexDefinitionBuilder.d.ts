import { CountersIndexDefinition } from "./CountersIndexDefinition";
import { AbstractIndexDefinitionBuilder } from "../AbstractIndexDefinitionBuilder";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
export declare class CountersIndexDefinitionBuilder extends AbstractIndexDefinitionBuilder<CountersIndexDefinition> {
    map: string;
    constructor(indexName?: string);
    protected _newIndexDefinition(): CountersIndexDefinition;
    toIndexDefinition(conventions: DocumentConventions, validateMap?: boolean): CountersIndexDefinition;
    protected _toIndexDefinition(indexDefinition: CountersIndexDefinition, conventions: DocumentConventions): void;
}
