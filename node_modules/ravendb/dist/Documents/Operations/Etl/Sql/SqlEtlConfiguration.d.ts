import { EtlConfiguration } from "../EtlConfiguration";
import { SqlEtlTable } from "./SqlEtlTable";
import { SqlConnectionString, EtlType } from "../ConnectionString";
import { DocumentConventions } from "../../../Conventions/DocumentConventions";
export declare class SqlEtlConfiguration extends EtlConfiguration<SqlConnectionString> {
    parameterizeDeletes: boolean;
    forceQueryRecompile: boolean;
    quoteTables: boolean;
    commandTimeout: number;
    sqlTables: SqlEtlTable[];
    get etlType(): EtlType;
    serialize(conventions: DocumentConventions): object;
}
