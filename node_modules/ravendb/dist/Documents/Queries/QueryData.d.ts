import { DeclareToken } from "../Session/Tokens/DeclareToken";
import { LoadToken } from "../Session/Tokens/LoadToken";
import { ProjectionBehavior } from "./ProjectionBehavior";
export declare class QueryData {
    fields: string[];
    projections: string[];
    fromAlias: string;
    declareTokens: DeclareToken[];
    loadTokens: LoadToken[];
    isCustomFunction: boolean;
    mapReduce: boolean;
    isProjectInto: boolean;
    projectionBehavior: ProjectionBehavior;
    constructor(fields: string[], projections: string[]);
    constructor(fields: string[], projections: string[], fromAlias: string, declareTokens: DeclareToken[], loadTokens: LoadToken[], isCustomFunction: boolean);
    static customFunction(alias: string, func: string): QueryData;
}
