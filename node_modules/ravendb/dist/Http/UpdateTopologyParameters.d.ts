import { ServerNode } from "./ServerNode";
export declare class UpdateTopologyParameters {
    readonly node: ServerNode;
    timeoutInMs: number;
    forceUpdate: boolean;
    debugTag: string;
    applicationIdentifier: string;
    constructor(node: ServerNode);
}
