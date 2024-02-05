import { AbstractIndexDefinitionBuilder } from "../AbstractIndexDefinitionBuilder";
import { TimeSeriesIndexDefinition } from "./TimeSeriesIndexDefinition";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
export declare class TimeSeriesIndexDefinitionBuilder extends AbstractIndexDefinitionBuilder<TimeSeriesIndexDefinition> {
    map: string;
    constructor(indexName?: string);
    protected _newIndexDefinition(): TimeSeriesIndexDefinition;
    toIndexDefinition(conventions: DocumentConventions, validateMap?: boolean): TimeSeriesIndexDefinition;
    protected _toIndexDefinition(indexDefinition: TimeSeriesIndexDefinition, conventions: DocumentConventions): void;
}
