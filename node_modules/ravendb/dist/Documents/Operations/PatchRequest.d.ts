import { DocumentConventions } from "../Conventions/DocumentConventions";
export declare class PatchRequest {
    script: string;
    values: {
        [key: string]: any;
    };
    static forScript(script: string): PatchRequest & {
        script: string;
    };
    serialize(conventions: DocumentConventions): {
        Script: string;
    };
}
