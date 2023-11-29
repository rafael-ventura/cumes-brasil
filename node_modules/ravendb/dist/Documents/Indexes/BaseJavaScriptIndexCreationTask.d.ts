import { AbstractGenericIndexCreationTask } from "./AbstractGenericIndexCreationTask";
import { EnumMapping } from "./Enums";
export declare abstract class BaseJavaScriptIndexCreationTask<TField extends string = string> extends AbstractGenericIndexCreationTask<TField> {
    protected _registeredEnums: EnumMapping[];
    protected postProcessDefinition(definition: string, origin: "map" | "reduce"): string;
    protected registerEnum(provider: () => string | number): void;
}
