import { EtlConfiguration } from "./EtlConfiguration";
import { RavenConnectionString, EtlType } from "./ConnectionString";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
export declare class RavenEtlConfiguration extends EtlConfiguration<RavenConnectionString> {
    loadRequestTimeoutInSec: number;
    get etlType(): EtlType;
    serialize(conventions: DocumentConventions): object;
}
