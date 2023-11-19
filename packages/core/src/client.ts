import { insertParamsIntoPath } from "./paths"
import { isRoute, IsRoute, RouteAny } from "./server"

type FetcherInput = Pick<RouteAny, "body" | "method" | "query" | "path">

type ClientHandlers<R extends Record<any, any>> = {
  [Key in keyof R]: IsRoute<R[Key]> extends true ? ClientHandler<R[Key]> : ClientHandlers<R[Key]>
}

type ClientHandlerArgs<R extends RouteAny, P extends Parameters<R["handler"]>[0] = Parameters<R["handler"]>[0]> = {
  [Key in keyof P as Key extends "query" | "body" | "params" ? Key : never]: P[Key]
}

type ClientHandler<R extends RouteAny> = (arg: ClientHandlerArgs<R>) => Promise<ReturnType<R["handler"]>>

export function initClient<Router extends { [key: string]: Record<any, any> | RouteAny }>(
  _router: Router,
  mapFetcher: (args: FetcherInput) => Promise<any>
) {
  const get = (t: Record<any, any>, path: string[]) => path.reduce((r, k) => r?.[k], t)

  function clientHandlersBuild(rec: { [key: string]: Record<any, any> | RouteAny }, keys: string[] = []) {
    for (const key in rec) {
      const route = rec[key]

      if (!isRoute(route)) {
        clientHandlersBuild(route, [...keys, key])
      } else {
        get(_router, keys)[key] = (args: { query: any, body: any, params: any }) => mapFetcher({
          method: route.method,
          ...(args.query && { query: args.query }),
          ...(route.method !== "GET" && { body: args.body }),
          path: insertParamsIntoPath({ path: `${route.path}`, params: args.params })
        })
      }
    }
  }

  clientHandlersBuild(_router)

  return (_router as any) as ClientHandlers<Router>
}