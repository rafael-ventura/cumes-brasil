import { AbstractGenericTimeSeriesIndexCreationTask } from "./AbstractGenericTimeSeriesIndexCreationTask";
import { TimeSeriesIndexDefinition } from "./TimeSeriesIndexDefinition";
export declare abstract class AbstractCsharpTimeSeriesIndexCreationTask extends AbstractGenericTimeSeriesIndexCreationTask {
    map: string;
    createIndexDefinition(): TimeSeriesIndexDefinition;
}
