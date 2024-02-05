import { IndexConfiguration } from "./IndexDefinition";
import { AdditionalAssembly } from "./AdditionalAssembly";
export declare abstract class AbstractCommonApiForIndexes {
    additionalSources: Record<string, string>;
    additionalAssemblies: AdditionalAssembly[];
    configuration: IndexConfiguration;
    protected constructor();
    get isMapReduce(): boolean;
    getIndexName(): string;
    static getIndexNameForCtor(indexCtorName: string): string;
}
