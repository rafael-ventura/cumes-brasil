import { ServerNode } from "./ServerNode";
export declare class Topology {
    etag: number;
    nodes?: ServerNode[];
    constructor(etag?: number, nodes?: ServerNode[]);
}
