import * as semaphore from "semaphore";
import { IDisposable } from "../Types/Contracts";
export interface AcquireSemaphoreOptions {
    timeout?: number;
    contextName?: string;
}
export interface SemaphoreAcquisitionContext extends IDisposable {
    promise: Promise<void>;
}
export declare function acquireSemaphore(sem: semaphore.Semaphore, semOpts?: AcquireSemaphoreOptions): SemaphoreAcquisitionContext;
