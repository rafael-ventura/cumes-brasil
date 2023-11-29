import { ObjectTypeDescriptor, EntityConstructor } from "../Types";
import { DocumentConventions } from "../Documents/Conventions/DocumentConventions";
export interface TypeInfo {
    typeName?: string;
    nestedTypes?: NestedTypes;
}
export interface NestedTypes {
    [propertyPath: string]: string;
}
export interface ITypesAwareObjectMapper {
    fromObjectLiteral<TResult extends object>(raw: object, typeInfo?: TypeInfo): TResult;
    toObjectLiteral<TFrom extends object>(obj: TFrom, typeInfo?: (typeInfo: TypeInfo) => void): object;
}
export declare class TypesAwareObjectMapper implements ITypesAwareObjectMapper {
    private _dateFormat;
    private _throwMappingErrors;
    private _conventions;
    constructor(opts?: TypesAwareJsonObjectMapperOptions);
    get throwMappingErrors(): boolean;
    set throwMappingErrors(value: boolean);
    fromObjectLiteral<TResult extends object>(rawResult: object, typeInfo?: TypeInfo): TResult;
    fromObjectLiteral<TResult extends object>(rawResult: object, typeInfo?: TypeInfo, knownTypes?: Map<string, ObjectTypeDescriptor>): TResult;
    private _applyNestedTypes;
    toObjectLiteral<TFrom extends object>(obj: TFrom): object;
    toObjectLiteral<TFrom extends object>(obj: TFrom, typeInfoCallback?: (typeInfo: TypeInfo) => void): object;
    toObjectLiteral<TFrom extends object>(obj: TFrom, typeInfoCallback?: (typeInfo: TypeInfo) => void, knownTypes?: Map<string, ObjectTypeDescriptor>): object;
    private _getFieldContext;
    private _getFieldContextsForMapEntries;
    private _getFieldContextsForSetElements;
    private _getFieldContextsForArrayElements;
    private _flattenFieldContexts;
    private _applyTypeToNestedProperty;
    private _instantiateObject;
    private _getKnownType;
    protected createEmptyObject<TResult extends object>(ctor: EntityConstructor<TResult>, rawValue: object): TResult;
    private _makeObjectLiteral;
}
export interface TypesAwareJsonObjectMapperOptions {
    dateFormat?: string;
    documentConventions?: DocumentConventions;
}
