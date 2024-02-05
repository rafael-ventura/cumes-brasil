export declare class Transformation {
    name: string;
    disabled?: boolean;
    collections?: string[];
    applyToAllDocuments?: boolean;
    script?: string;
}
export declare function serializeTransformation(transformation: Transformation): {
    Name: string;
    Disabled: boolean;
    Collections: string[];
    ApplyToAllDocuments: boolean;
    Script: string;
};
