import { IndexDefinition } from "./IndexDefinition";
import { AbstractGenericIndexCreationTask } from "./AbstractGenericIndexCreationTask";
export declare class AbstractCsharpMultiMapIndexCreationTask extends AbstractGenericIndexCreationTask {
    private maps;
    reduce: string;
    get isMapReduce(): boolean;
    protected addMap(map: string): void;
    createIndexDefinition(): IndexDefinition;
}
