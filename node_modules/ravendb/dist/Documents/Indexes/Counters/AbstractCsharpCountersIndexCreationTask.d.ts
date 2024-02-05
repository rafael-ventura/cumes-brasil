import { AbstractGenericCountersIndexCreationTask } from "./AbstractGenericCountersIndexCreationTask";
import { CountersIndexDefinition } from "./CountersIndexDefinition";
export declare abstract class AbstractCsharpCountersIndexCreationTask extends AbstractGenericCountersIndexCreationTask {
    map: string;
    createIndexDefinition(): CountersIndexDefinition;
}
