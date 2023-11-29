import { DocumentType } from "../Documents/DocumentAbstractions";
import { ObjectTypeDescriptor, ClassConstructor } from "../Types";
export declare class TypeUtil {
    static readonly MAX_INT32 = 2147483647;
    static readonly MIN_INT32 = -2147483648;
    static NOOP: (...args: any[]) => any;
    static ASYNC_NOOP: (...args: any[]) => Promise<any>;
    static isNullOrUndefined(value: any): boolean;
    static isUndefined(value: any): boolean;
    static isString(value: any): value is string;
    static isNumber(value: any): value is number;
    static isPrimitive(value: any): value is number | string | boolean;
    static isPrimitiveType(type: any): boolean;
    static isArray<T = any>(value: any): value is T[];
    static isObject(value: any): value is object;
    static isFunction(value: any): value is Function;
    static isDate(value: any): value is Date;
    static isBool(value: any): value is boolean;
    static isClass(value: any): value is ClassConstructor;
    static isObjectTypeDescriptor(value: any): value is ObjectTypeDescriptor;
    static isType(obj: object, typeDescriptor: DocumentType): boolean;
    static isObjectLiteralTypeDescriptor(typeDescriptor: ObjectTypeDescriptor): boolean;
    static findType(obj: object, typeDescriptors: ObjectTypeDescriptor[]): ObjectTypeDescriptor;
    static isInstanceOf(type: ObjectTypeDescriptor, typeToCheck: ObjectTypeDescriptor): boolean;
    static isSet(obj: any): boolean;
    static isMap(obj: any): boolean;
    static isDocumentType<TEntity>(obj: any): boolean;
}
