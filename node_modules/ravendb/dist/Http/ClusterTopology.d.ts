export declare class ClusterTopology {
    lastNodeId: string;
    topologyId: string;
    etag: number;
    members: {
        [key: string]: string;
    };
    promotables: {
        [key: string]: string;
    };
    watchers: {
        [key: string]: string;
    };
    contains(node: string): string | true;
    getUrlFromTag(tag: string): string;
    getAllNodes(): {
        [tag: string]: string;
    };
}
