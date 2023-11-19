import { IncomingMessage } from "http";
import { RouteAny } from "./server";
import { pathToRegexp } from "path-to-regexp";

export function routeMatch(routes: Record<any, RouteAny>, request: IncomingMessage): RouteAny | null {
  let requestPath = ""
  if (request.url) requestPath = request.url.split("?")[0]

  return Object.values(routes).filter(route => pathToRegexp(route.path).test(requestPath) && route.method === request.method)[0] || null
}