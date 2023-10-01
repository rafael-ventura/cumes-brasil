import { PeriodicBackupConfiguration } from "../../../Documents/Operations/Backups/PeriodicBackupConfiguration";
import { IServerWideTask } from "../OngoingTasks/IServerWideTask";
export interface ServerWideBackupConfiguration extends PeriodicBackupConfiguration, IServerWideTask {
}
