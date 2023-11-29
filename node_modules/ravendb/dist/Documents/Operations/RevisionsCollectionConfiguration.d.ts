import { SetupDocumentBase } from "../SetupDocumentBase";
export declare class RevisionsCollectionConfiguration extends SetupDocumentBase {
    minimumRevisionsToKeep?: number;
    minimumRevisionAgeToKeep?: string;
    disabled: boolean;
    purgeOnDelete?: boolean;
    maximumRevisionsToDeleteUponDocumentUpdate?: number;
    toRemoteFieldNames(): object;
}
