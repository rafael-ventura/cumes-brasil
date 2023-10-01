import { IDatabaseSmugglerOptions } from "./IDatabaseSmugglerOptions";
import { DatabaseItemType } from "./DatabaseItemType";
import { DatabaseRecordItemType } from "./DatabaseRecordItemType";
export declare class DatabaseSmugglerOptions implements IDatabaseSmugglerOptions {
    static readonly DEFAULT_OPERATE_ON_TYPES: DatabaseItemType[];
    static readonly DEFAULT_OPERATE_ON_DATABASE_RECORD_TYPES: DatabaseRecordItemType[];
    private static readonly DEFAULT_MAX_STEPS_FOR_TRANSFORM_SCRIPT;
    operateOnTypes: DatabaseItemType[];
    operateOnDatabaseRecordType: DatabaseRecordItemType[];
    includeExpired: boolean;
    includeArtificial: boolean;
    removeAnalyzers: boolean;
    transformScript: string;
    maxStepsForTransformScript: number;
    skipRevisionCreation: boolean;
    encryptionKey: string;
    constructor();
}
