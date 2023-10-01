import { IDatabaseSmugglerImportOptions } from "./IDatabaseSmugglerImportOptions";
import { DatabaseSmugglerOptions } from "./DatabaseSmugglerOptions";
export declare class DatabaseSmugglerImportOptions extends DatabaseSmugglerOptions implements IDatabaseSmugglerImportOptions {
    skipRevisionCreation: boolean;
    constructor();
    constructor(options: DatabaseSmugglerOptions);
}
