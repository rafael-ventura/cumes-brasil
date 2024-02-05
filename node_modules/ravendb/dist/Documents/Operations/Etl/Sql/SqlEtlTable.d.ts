export interface SqlEtlTable {
    tableName: string;
    documentIdColumn: string;
    insertOnlyMode: boolean;
}
export declare function serializeSqlEtlTable(table: SqlEtlTable): object;
