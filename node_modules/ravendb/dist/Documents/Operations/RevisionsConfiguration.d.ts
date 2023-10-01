import { SetupDocumentBase } from "../SetupDocumentBase";
import { RevisionsCollectionConfiguration } from "./RevisionsCollectionConfiguration";
export declare class RevisionsConfiguration extends SetupDocumentBase {
    defaultConfig: RevisionsCollectionConfiguration;
    collections: Map<string, RevisionsCollectionConfiguration>;
    toRemoteFieldNames(): {
        Default: object;
        Collections: {
            [key: string]: object;
        };
    };
}
