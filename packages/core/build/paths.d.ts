import { Character } from "./utils/type-utils";
type RecursivelyExtractPathParams<T extends string, TAcc extends null | Record<string, string>> = T extends `/:${infer PathParam}/${infer Right}` ? {
    [key in PathParam]: string;
} & RecursivelyExtractPathParams<Right, TAcc> : T extends `/:${infer PathParam}` ? {
    [key in PathParam]: string;
} : T extends `/${string}/${infer Right}` ? RecursivelyExtractPathParams<Right, TAcc> : T extends `/${string}` ? TAcc : T extends `:${infer PathParam}/${infer Right}` ? {
    [key in PathParam]: string;
} & RecursivelyExtractPathParams<Right, TAcc> : T extends `:${infer PathParam}` ? TAcc & {
    [key in PathParam]: string;
} : T extends `${string}/${infer Right}` ? RecursivelyExtractPathParams<Right, TAcc> : TAcc;
export type ParamsFromUrl<T extends string> = RecursivelyExtractPathParams<T, {}> extends infer U ? {
    [key in keyof U]: U[key];
} : never;
export declare const insertParamsIntoPath: <T extends string>({ path, params, }: {
    path: T;
    params: ParamsFromUrl<T> extends never ? {} : ParamsFromUrl<T>;
}) => string;
export type PathWithSlash<Path extends string> = Path extends `${infer First}${infer Other}` ? First extends Character ? `/${Path}` : Path : Path;
export {};
//# sourceMappingURL=paths.d.ts.map