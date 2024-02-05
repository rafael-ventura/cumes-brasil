import * as stream from "readable-stream";
import { ObjectChangeCaseOptions, ObjectChangeCaseOptionsBase, CasingConvention } from "../../../Utility/ObjectUtil";
export interface ObjectKeyCaseTransformStreamOptionsBase extends ObjectChangeCaseOptionsBase {
    extractIgnorePaths?: ((entry: object) => (string | RegExp)[]);
    defaultTransform?: CasingConvention;
}
export interface ObjectKeyCaseTransformStreamOptions extends ObjectChangeCaseOptions {
    handleKeyValue?: boolean;
    extractIgnorePaths?: ((entry: object) => (string | RegExp)[]);
}
export declare class ObjectKeyCaseTransformStream extends stream.Transform {
    private _opts;
    private _ignorePaths;
    private readonly _getIgnorePaths;
    private readonly _handleKeyValue;
    constructor(_opts: ObjectKeyCaseTransformStreamOptions);
    _transform(chunk: any, enc: string, callback: any): any;
    private static _validateOpts;
}
