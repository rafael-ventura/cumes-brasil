import { TypesAwareObjectMapper } from "../../Mapping/ObjectMapper";
export declare class HashCalculator {
    private _buffers;
    getHash(): string;
    write(o: any, mapper?: TypesAwareObjectMapper): void;
}
