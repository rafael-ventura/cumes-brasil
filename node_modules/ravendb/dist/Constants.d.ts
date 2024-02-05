export declare const CONSTANTS: {
    readonly Documents: {
        readonly Indexing: {
            readonly Fields: {
                readonly ALL_FIELDS: "__all_fields";
                readonly DOCUMENT_ID_FIELD_NAME: "id()";
                readonly SOURCE_DOCUMENT_ID_FIELD_NAME: "sourceDocId()";
                readonly REDUCE_KEY_HASH_FIELD_NAME: "hash(key())";
                readonly REDUCE_KEY_KEY_VALUE_FIELD_NAME: "key()";
                readonly VALUE_FIELD_NAME: "value()";
                readonly SPATIAL_SHAPE_FIELD_NAME: "spatial(shape)";
            };
            readonly Spatial: {
                readonly DEFAULT_DISTANCE_ERROR_PCT: 0.025;
            };
            readonly SIDE_BY_SIDE_INDEX_NAME_PREFIX: "ReplacementOf/";
        };
        readonly Metadata: {
            readonly COLLECTION: "@collection";
            readonly PROJECTION: "@projection";
            readonly KEY: "@metadata";
            readonly ID: "@id";
            readonly CONFLICT: "@conflict";
            readonly ID_PROPERTY: "id";
            readonly FLAGS: "@flags";
            readonly ATTACHMENTS: "@attachments";
            readonly INDEX_SCORE: "@index-score";
            readonly LAST_MODIFIED: "@last-modified";
            readonly RAVEN_JS_TYPE: "Raven-Node-Type";
            readonly CHANGE_VECTOR: "@change-vector";
            readonly EXPIRES: "@expires";
            readonly ALL_DOCUMENTS_COLLECTION: "@all_docs";
            readonly EMPTY_COLLECTION: "@empty";
            readonly NESTED_OBJECT_TYPES: "@nested-object-types";
            readonly NESTED_OBJECT_TYPES_PROJECTION_FIELD: "__PROJECTED_NESTED_OBJECT_TYPES__";
            readonly COUNTERS: "@counters";
            readonly TIME_SERIES: "@timeseries";
            readonly REVISION_COUNTERS: "@counters-snapshot";
            readonly REVISION_TIME_SERIES: "@timeseries-snapshot";
            readonly IGNORE_CASE_TRANSFORM_REGEX: RegExp;
        };
        readonly PeriodicBackup: {
            readonly FULL_BACKUP_EXTENSION: "ravendb-full-backup";
            readonly SNAPSHOT_EXTENSION: "ravendb-snapshot";
            readonly ENCRYPTED_FULL_BACKUP_EXTENSION: ".ravendb-encrypted-full-backup";
            readonly ENCRYPTED_SNAPSHOT_EXTENSION: ".ravendb-encrypted-snapshot";
            readonly INCREMENTAL_BACKUP_EXTENSION: "ravendb-incremental-backup";
            readonly ENCRYPTED_INCREMENTAL_BACKUP_EXTENSION: ".ravendb-encrypted-incremental-backup";
            readonly Folders: {
                readonly INDEXES: "Indexes";
                readonly DOCUMENTS: "Documents";
                readonly CONFIGURATION: "Configuration";
            };
        };
    };
};
export declare const HEADERS: {
    readonly REQUEST_TIME: "Raven-Request-Time";
    readonly REFRESH_TOPOLOGY: "Refresh-Topology";
    readonly TOPOLOGY_ETAG: "Topology-Etag";
    readonly LAST_KNOWN_CLUSTER_TRANSACTION_INDEX: "Known-Raft-Index";
    readonly CLIENT_CONFIGURATION_ETAG: "Client-Configuration-Etag";
    readonly REFRESH_CLIENT_CONFIGURATION: "Refresh-Client-Configuration";
    readonly CLIENT_VERSION: "Raven-Client-Version";
    readonly SERVER_VERSION: "Raven-Server-Version";
    readonly ETAG: "ETag";
    readonly IF_NONE_MATCH: "If-None-Match";
    readonly TRANSFER_ENCODING: "Transfer-Encoding";
    readonly CONTENT_ENCODING: "Content-Encoding";
    readonly CONTENT_LENGTH: "Content-Length";
    readonly DATABASE_MISSING: "Database-Missing";
};
export declare const COUNTERS: {
    readonly ALL: "@all_counters";
};
export declare const TIME_SERIES: {
    readonly SELECT_FIELD_NAME: "timeseries";
    readonly QUERY_FUNCTION: "__timeSeriesQueryFunction";
    readonly ALL: "@all_timeseries";
};
export declare const COMPARE_EXCHANGE: {
    readonly OBJECT_FIELD_NAME: "Object";
};
