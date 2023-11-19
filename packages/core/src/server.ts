import { bodyParse } from "./parsers/body-parse";
import { queryParse } from "./parsers/query-parse";
import { paramsParse } from "./parsers/params-parse";
import { routeMatch } from "./route-match";
import { ExcludeByType, IsEmptyObject } from "./utils/type-utils";
import { ParamsFromUrl, PathWithSlash } from "./paths";

type DeclareSchema = <S extends Record<any, any>>() => S

type RequestMethod = 'POST' | 'DELETE' | 'PUT' | 'PATCH' | "GET"

type RouteRequest<Path extends string = "", Body extends RequestBody = {}, Query extends RequestQuery = {}, Context extends {} = {}> = ExcludeByType<{
  body: IsEmptyObject<Body> extends true ? never : Body
  query: IsEmptyObject<Query> extends true ? never : Query
  params: IsEmptyObject<ParamsFromUrl<Path>> extends true ? never : ParamsFromUrl<Path>
}, never> & Context

type RequestBody = Record<any, any> | undefined
type RequestQuery = Record<any, any> | undefined

type Route<Path extends string, Method extends RequestMethod, Body extends RequestBody, Query extends RequestQuery, Response = any, Context extends {} = {}> = ExcludeByType<{
  path: PathWithSlash<Path>,
  method: Method,
  body: IsEmptyObject<Body> extends true ? never : Body
  query: IsEmptyObject<Query> extends true ? never : Query
  handler: (req: RouteRequest<Path, Body, Query, Context>) => Response
}, undefined | never>

export type RouteAny = Route<any, any, any, any, any, any>

export type IsRoute<Obj extends Record<any, any>> = IsEmptyObject<Obj> extends false ? keyof Obj extends keyof RouteAny ? true : false : false

export function isRoute(val: RouteAny | Record<any, any>): val is RouteAny {
  return Boolean(val["method"])
}

export function initServer<Ctx extends (req: Request, res: Response) => object>(context?: Ctx) {
  type CtxType = ReturnType<Ctx>

  class RouteBuilder<Path extends string, Method extends RequestMethod, Body extends RequestBody, Query extends RequestQuery> {
    route = {} as RouteAny

    path<P extends Path>(_path: P): { method: RouteBuilder<P, Method, Body, Query>["method"] } {
      this.route["path"] = (!_path.startsWith("/") ? `/${_path}` : _path) as PathWithSlash<Path>
      return this as any
    }

    method<M extends Method>(_method: M): M extends "GET" ? { query: RouteBuilder<Path, M, Query, Body>["query"], handler: RouteBuilder<Path, M, Query, Body>["handler"], } : { body: RouteBuilder<Path, M, Body, Query>["body"] } {
      this.route["method"] = _method
      return this as any
    }

    body<B extends Body>(_body: B): { handler: RouteBuilder<Path, Method, B, undefined>["handler"] } {
      this.route["body"] = _body
      return this as any
    }

    query<Q extends Query>(_query: Q): { handler: RouteBuilder<Path, Method, undefined, Q>["handler"] } {
      this.route["query"] = _query
      return this as any
    }

    // THIS as Отвечает за вывод типа роутов
    handler<Response extends any>(_handler: (req: RouteRequest<Path, Body, Query, CtxType>) => Response) {
      this.route["handler"] = _handler
      return this["route"] as Route<PathWithSlash<Path>, Method, Body, Query, Response, CtxType>
    }
  }

  function route(): { path: RouteBuilder<string, RequestMethod, RequestBody, RequestQuery>["path"] } {
    return new RouteBuilder()
  }

  const declareSchema: DeclareSchema = function () { } as DeclareSchema

  function createRouter(router: Record<any, any>, req: any, res: any) {
    const routes: Record<string, RouteAny> = {}

    function extractRoutes(router: Record<any, any>) {
      for (const routerKey in router) {
        const recordOrRoute: RouteAny | Record<any, any> = router[routerKey];
        if (recordOrRoute.method) {
          if (!routes[recordOrRoute.path + recordOrRoute.method]) {
            routes[recordOrRoute.path + recordOrRoute.method] = (recordOrRoute as RouteAny)
          } else {
            throw new Error("Two equal route")
          }
        } else {
          extractRoutes(recordOrRoute)
        }
      }
    }

    extractRoutes(router)

    async function routesHandle(): Promise<{
      status: 200 | 404 | 500,
      message?: "route not found" | "bad request"
    }> {
      try {
        const route = routeMatch(routes, req)

        if (route) {
          req.params = paramsParse(route, req)
          req.body = await bodyParse(req)
          req.query = queryParse(req)

          let response = await route.handler({ ...req, ...(context !== undefined && context(req, res)) } as RouteRequest<any>)

          res.writeHead(200, { "Content-Type": "application/json" });
          response && res.write(JSON.stringify(response));
          res.end()

          return { status: 200 }
        } else {
          return { status: 404, message: "route not found" }
        }
      } catch (err: any) {
        console.log(err)
        return { status: 500, message: err.message }
      }
    }

    return routesHandle()
  }

  return { route, createRouter, declareSchema }
}