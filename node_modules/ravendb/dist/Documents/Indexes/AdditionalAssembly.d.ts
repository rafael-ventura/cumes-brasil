export declare class AdditionalAssembly {
    assemblyName: string;
    assemblyPath: string;
    packageName: string;
    packageVersion: string;
    packageSourceUrl: string;
    usings: string[];
    private constructor();
    static onlyUsings(usings: string[]): AdditionalAssembly;
    static fromRuntime(assemblyName: string, usings?: string[]): AdditionalAssembly;
    static fromPath(assemblyPath: string, usings?: string[]): AdditionalAssembly;
    static fromNuGet(packageName: string, packageVersion: string, packageSourceUrl?: string, usings?: string[]): AdditionalAssembly;
}
