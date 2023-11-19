////////////////////////////////////////
// copy paste from https://github.com/ts-rest/ts-rest/blob/main/libs/ts-rest/core/src/lib/paths.ts
import { Character } from "./utils/type-utils";

type RecursivelyExtractPathParams<T extends string,
  TAcc extends null | Record<string, string>> = T extends `/:${infer PathParam}/${infer Right}`
  ? { [key in PathParam]: string } & RecursivelyExtractPathParams<Right, TAcc>
  : T extends `/:${infer PathParam}`
    ? { [key in PathParam]: string }
    : T extends `/${string}/${infer Right}`
      ? RecursivelyExtractPathParams<Right, TAcc>
      : T extends `/${string}`
        ? TAcc
        : T extends `:${infer PathParam}/${infer Right}`
          ? { [key in PathParam]: string } & RecursivelyExtractPathParams<Right, TAcc>
          : T extends `:${infer PathParam}`
            ? TAcc & { [key in PathParam]: string }
            : T extends `${string}/${infer Right}`
              ? RecursivelyExtractPathParams<Right, TAcc>
              : TAcc;

export type ParamsFromUrl<T extends string> = RecursivelyExtractPathParams<T,
  {}> extends infer U
  ? {
    [key in keyof U]: U[key];
  }
  : never;

//type test = ParamsFromUrl<"">
//let test: ParamsFromUrl<"sas">

export const insertParamsIntoPath = <T extends string>({ path, params, }: {
  path: T;
  params: ParamsFromUrl<T> extends never ? {} : ParamsFromUrl<T>;
}) => {
  return path
    .replace(/:([^/]+)/g, (_, p) => {
      return (params as any)[p] || '';
    })
    .replace(/\/\//g, '/');
};
//
////////////////////////////////////////


export type PathWithSlash<Path extends string> = Path extends `${infer First}${infer Other}` ? First extends Character ? `/${Path}` : Path : Path

//const test2 = insertParamsIntoPath({ path: "sas/:id/:nice", params: { id: "", nice: "" } })