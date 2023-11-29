import { CommandType } from "./Commands/CommandData";
export declare class IdTypeAndName {
    private id;
    private type;
    private name;
    equals(o: object): boolean;
    static create(id: string, type: CommandType, name: string): IdTypeAndName;
    key(): string;
    static keyFor(id: string, type: CommandType, name: string): string;
}
