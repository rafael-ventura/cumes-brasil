import { DatabaseSmugglerOptions } from "./DatabaseSmugglerOptions";
import { IDatabaseSmugglerExportOptions } from "./IDatabaseSmugglerExportOptions";
export declare class DatabaseSmugglerExportOptions extends DatabaseSmugglerOptions implements IDatabaseSmugglerExportOptions {
    collections: string[];
    constructor();
}
