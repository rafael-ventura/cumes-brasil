import { EtlConfiguration } from "../EtlConfiguration";
import { OlapConnectionString } from "../ConnectionString";
import { OlapEtlFileFormat } from "./OlapEtlFileFormat";
import { OlapEtlTable } from "./OlapEtlTable";
export declare class OlapEtlConfiguration extends EtlConfiguration<OlapConnectionString> {
    runFrequency: string;
    format: OlapEtlFileFormat;
    customPartitionValue: string;
    olapTables: OlapEtlTable[];
}
