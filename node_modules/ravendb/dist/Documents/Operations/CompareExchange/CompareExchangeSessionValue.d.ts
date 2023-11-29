import { CompareExchangeValue } from "./CompareExchangeValue";
import { CompareExchangeValueState } from "./CompareExchangeValueState";
import { CompareExchangeResultClass } from "../../../Types";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { ICommandData } from "../../Commands/CommandData";
import { TypesAwareObjectMapper } from "../../../Mapping/ObjectMapper";
import { IMetadataDictionary } from "../../Session/IMetadataDictionary";
export declare class CompareExchangeSessionValue {
    private readonly _key;
    private _index;
    private _originalValue;
    private _value;
    private _state;
    constructor(key: string, index: number, state: CompareExchangeValueState);
    constructor(value: CompareExchangeValue<any>);
    getValue<T>(clazz: CompareExchangeResultClass<T>, conventions: DocumentConventions): CompareExchangeValue<T>;
    create<T>(item: T): CompareExchangeValue<T>;
    delete(index: number): void;
    private _assertState;
    getCommand(conventions: DocumentConventions): ICommandData;
    private _convertEntity;
    hasChanged(originalValue: CompareExchangeValue<unknown>, newValue: CompareExchangeValue<unknown>): boolean;
    updateState(index: number): void;
    updateValue(value: CompareExchangeValue<object>, mapper: TypesAwareObjectMapper): void;
    static prepareMetadataForPut(key: string, metadataDictionary: IMetadataDictionary, conventions: DocumentConventions): object;
    private static _throwInvalidExpiresMetadata;
}
