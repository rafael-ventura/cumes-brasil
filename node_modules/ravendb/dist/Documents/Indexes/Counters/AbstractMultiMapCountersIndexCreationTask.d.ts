import { AbstractGenericCountersIndexCreationTask } from "./AbstractGenericCountersIndexCreationTask";
import { CountersIndexDefinition } from "./CountersIndexDefinition";
export declare abstract class AbstractMultiMapCountersIndexCreationTask extends AbstractGenericCountersIndexCreationTask {
    private readonly maps;
    protected _addMap(map: string): void;
    createIndexDefinition(): CountersIndexDefinition;
}
