/// <reference types="node" />
import { Socket } from "net";
import { TcpNegotiateParameters } from "./TcpNegotiateParameters";
import { SupportedFeatures } from "./TcpConnectionHeaderMessage";
export declare const OUT_OF_RANGE_STATUS = -1;
export declare class TcpNegotiation {
    static negotiateProtocolVersion(socket: Socket, parameters: TcpNegotiateParameters): Promise<SupportedFeatures>;
    private static _sendTcpVersionInfo;
}
