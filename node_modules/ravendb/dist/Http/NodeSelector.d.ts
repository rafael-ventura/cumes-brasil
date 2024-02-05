import { ServerNode } from "../Http/ServerNode";
import CurrentIndexAndNode from "../Http/CurrentIndexAndNode";
import { Topology } from "./Topology";
import { CurrentIndexAndNodeAndEtag } from "./CurrentIndexAndNodeAndEtag";
declare class NodeSelectorState {
    topology: Topology;
    nodes: ServerNode[];
    failures: number[];
    fastestRecords: number[];
    fastest: number;
    speedTestMode: number;
    unlikelyEveryoneFaultedChoiceIndex: number;
    constructor(topology: Topology);
    getNodeWhenEveryoneMarkedAsFaulted(): CurrentIndexAndNode;
}
export declare class NodeSelector {
    private _updateFastestNodeTimer;
    private _state;
    constructor(topology: Topology);
    getTopology(): Topology;
    onFailedRequest(nodeIndex: number): void;
    onUpdateTopology(topology: Topology, forceUpdate?: boolean): boolean;
    getNodeBySessionId(sessionId: number): CurrentIndexAndNode;
    getRequestedNode(nodeTag: string): CurrentIndexAndNode;
    nodeIsAvailable(index: number): boolean;
    getPreferredNode(): CurrentIndexAndNode;
    static getPreferredNodeInternal(state: NodeSelectorState): CurrentIndexAndNode;
    getPreferredNodeWithTopology(): CurrentIndexAndNodeAndEtag;
    private static _unlikelyEveryoneFaultedChoice;
    getFastestNode(): CurrentIndexAndNode;
    restoreNodeIndex(nodeIndex: number): void;
    protected _throwEmptyTopology(): void;
    private _switchToSpeedTestPhase;
    inSpeedTestPhase(): boolean;
    recordFastest(index: number, node: ServerNode): void;
    private static _findMaxIndex;
    private _selectFastest;
    scheduleSpeedTest(): void;
}
export {};
