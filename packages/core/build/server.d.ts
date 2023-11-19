import { ExcludeByType, IsEmptyObject } from "./utils/type-utils";
import { ParamsFromUrl, PathWithSlash } from "./paths";
type DeclareSchema = <S extends Record<any, any>>() => S;
type RequestMethod = 'POST' | 'DELETE' | 'PUT' | 'PATCH' | "GET";
type RouteRequest<Path extends string = "", Body extends RequestBody = {}, Query extends RequestQuery = {}, Context extends {} = {}> = ExcludeByType<{
    body: IsEmptyObject<Body> extends true ? never : Body;
    query: IsEmptyObject<Query> extends true ? never : Query;
    params: IsEmptyObject<ParamsFromUrl<Path>> extends true ? never : ParamsFromUrl<Path>;
}, never> & Context;
type RequestBody = Record<any, any> | undefined;
type RequestQuery = Record<any, any> | undefined;
type Route<Path extends string, Method extends RequestMethod, Body extends RequestBody, Query extends RequestQuery, Response = any, Context extends {} = {}> = ExcludeByType<{
    path: PathWithSlash<Path>;
    method: Method;
    body: IsEmptyObject<Body> extends true ? never : Body;
    query: IsEmptyObject<Query> extends true ? never : Query;
    handler: (req: RouteRequest<Path, Body, Query, Context>) => Response;
}, undefined | never>;
export type RouteAny = Route<any, any, any, any, any, any>;
export type IsRoute<Obj extends Record<any, any>> = IsEmptyObject<Obj> extends false ? keyof Obj extends keyof RouteAny ? true : false : false;
export declare function isRoute(val: RouteAny | Record<any, any>): val is RouteAny;
export declare function initServer<Ctx extends (req: Request, res: Response) => object>(context?: Ctx): {
    route: () => {
        path: <P extends string>(_path: P) => {
            method: <M extends RequestMethod>(_method: M) => M extends "GET" ? {
                query: <Q extends RequestBody>(_query: Q) => {
                    handler: <Response_1 extends unknown>(_handler: (req: RouteRequest<P, undefined, Q, ReturnType<Ctx>>) => Response_1) => Route<PathWithSlash<P>, M, undefined, Q, Response_1, ReturnType<Ctx>>;
                };
                handler: <Response_2 extends unknown>(_handler: (req: RouteRequest<P, RequestQuery, RequestBody, ReturnType<Ctx>>) => Response_2) => Route<PathWithSlash<P>, M, RequestQuery, RequestBody, Response_2, ReturnType<Ctx>>;
            } : {
                body: <B extends RequestBody>(_body: B) => {
                    handler: <Response_3 extends unknown>(_handler: (req: RouteRequest<P, B, undefined, ReturnType<Ctx>>) => Response_3) => Route<PathWithSlash<P>, M, B, undefined, Response_3, ReturnType<Ctx>>;
                };
            };
        };
    };
    createRouter: (router: Record<any, any>, req: any, res: any) => Promise<{
        status: 200 | 404 | 500;
        message?: "route not found" | "bad request" | undefined;
    }>;
    declareSchema: DeclareSchema;
};
export {};
//# sourceMappingURL=server.d.ts.map