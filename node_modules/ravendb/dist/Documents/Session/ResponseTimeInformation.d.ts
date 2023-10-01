export declare class ResponseTimeInformation {
    totalServerDuration: number;
    totalClientDuration: number;
    durationBreakdown: ResponseTimeItem[];
    computeServerTotal(): void;
    constructor();
}
export interface ResponseTimeItem {
    url: string;
    duration: number;
}
