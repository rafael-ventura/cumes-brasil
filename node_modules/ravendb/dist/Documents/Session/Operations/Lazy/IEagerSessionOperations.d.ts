import { ResponseTimeInformation } from "../../ResponseTimeInformation";
export interface IEagerSessionOperations {
    executeAllPendingLazyOperations(): Promise<ResponseTimeInformation>;
}
