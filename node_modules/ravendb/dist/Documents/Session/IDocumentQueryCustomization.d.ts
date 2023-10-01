import { QueryOperation } from "./Operations/QueryOperation";
import { IndexQuery } from "../Queries/IndexQuery";
import { QueryResult } from "../Queries/QueryResult";
import { ValueCallback } from "../../Types/Callbacks";
import { QueryTimings } from "../Queries/Timings/QueryTimings";
import { ProjectionBehavior } from "../Queries/ProjectionBehavior";
import { AbstractDocumentQuery } from "./AbstractDocumentQuery";
export interface IDocumentQueryCustomization {
    getQueryOperation(): QueryOperation;
    getQuery(): AbstractDocumentQuery<any, any>;
    on(eventName: "beforeQueryExecuted", eventHandler: (eventArgs: IndexQuery) => void): IDocumentQueryCustomization;
    on(eventName: "afterQueryExecuted", eventHandler: (eventArgs: QueryResult) => void): IDocumentQueryCustomization;
    once(eventName: "beforeQueryExecuted", eventHandler: (eventArgs: IndexQuery) => void): IDocumentQueryCustomization;
    once(eventName: "afterQueryExecuted", eventHandler: (eventArgs: QueryResult) => void): IDocumentQueryCustomization;
    removeListener(eventName: "beforeQueryExecuted", eventHandler: (eventArgs: IndexQuery) => void): IDocumentQueryCustomization;
    removeListener(eventName: "afterQueryExecuted", eventHandler: (eventArgs: QueryResult) => void): IDocumentQueryCustomization;
    noCaching(): IDocumentQueryCustomization;
    noTracking(): IDocumentQueryCustomization;
    randomOrdering(): IDocumentQueryCustomization;
    randomOrdering(seed: string): IDocumentQueryCustomization;
    waitForNonStaleResults(): IDocumentQueryCustomization;
    waitForNonStaleResults(waitTimeout: number): IDocumentQueryCustomization;
    projection(projectionBehavior: ProjectionBehavior): IDocumentQueryCustomization;
    timings(timings: ValueCallback<QueryTimings>): IDocumentQueryCustomization;
}
