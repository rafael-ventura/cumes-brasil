import { Transformation } from "./Transformation";
import { ConnectionString } from "./ConnectionString";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
export declare class EtlConfiguration<T extends ConnectionString> {
    taskId: number;
    name: string;
    mentorNode: string;
    connectionStringName: string;
    transforms: Transformation[];
    disabled: boolean;
    allowEtlOnNonEncryptedChannel: boolean;
    serialize(conventions: DocumentConventions): object;
}
