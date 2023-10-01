import { TimeSeriesIndexDefinition } from "./TimeSeriesIndexDefinition";
import { AbstractGenericTimeSeriesIndexCreationTask } from "./AbstractGenericTimeSeriesIndexCreationTask";
export declare abstract class AbstractMultiMapTimeSeriesIndexCreationTask extends AbstractGenericTimeSeriesIndexCreationTask {
    private readonly maps;
    protected _addMap(map: string): void;
    createIndexDefinition(): TimeSeriesIndexDefinition;
}
