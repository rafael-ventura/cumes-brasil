import { IndexDefinition } from "./IndexDefinition";
import { AbstractGenericIndexCreationTask } from "./AbstractGenericIndexCreationTask";
export declare abstract class AbstractCsharpIndexCreationTask extends AbstractGenericIndexCreationTask {
    map: string;
    reduce: string;
    get isMapReduce(): boolean;
    createIndexDefinition(): IndexDefinition;
}
