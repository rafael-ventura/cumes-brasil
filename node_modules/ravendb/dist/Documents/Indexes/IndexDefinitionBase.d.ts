import { IndexPriority, IndexState } from "./Enums";
export declare abstract class IndexDefinitionBase {
    name: string;
    priority: IndexPriority;
    state: IndexState;
}
