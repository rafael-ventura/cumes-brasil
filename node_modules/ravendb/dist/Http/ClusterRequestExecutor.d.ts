import { RequestExecutor, IRequestExecutorOptions } from "./RequestExecutor";
import { ServerNode } from "./ServerNode";
import { IAuthOptions } from "../Auth/AuthOptions";
import { DocumentConventions } from "../Documents/Conventions/DocumentConventions";
import { UpdateTopologyParameters } from "./UpdateTopologyParameters";
export declare class ClusterRequestExecutor extends RequestExecutor {
    private _clusterTopologySemaphore;
    protected constructor(authOptions: IAuthOptions, conventions: DocumentConventions);
    static createForSingleNodeWithConfigurationUpdates(url: string, databaseName: string, opts: IRequestExecutorOptions): ClusterRequestExecutor;
    static createForSingleNodeWithoutConfigurationUpdates(url: string, databaseName: string, opts: IRequestExecutorOptions): ClusterRequestExecutor;
    static createForSingleNode(url: string, opts: IRequestExecutorOptions): ClusterRequestExecutor;
    static createForSingleNode(url: string, opts: IRequestExecutorOptions): ClusterRequestExecutor;
    static create(initialUrls: string[], database: string, opts?: IRequestExecutorOptions): ClusterRequestExecutor;
    static create(initialUrls: string[], opts?: IRequestExecutorOptions): ClusterRequestExecutor;
    protected _performHealthCheck(serverNode: ServerNode, nodeIndex: number): Promise<void>;
    updateTopology(parameters: UpdateTopologyParameters): Promise<boolean>;
    protected _updateClientConfigurationAsync(serverNode: ServerNode): Promise<void>;
    protected _throwExceptions(details: string): void;
    dispose(): void;
}
