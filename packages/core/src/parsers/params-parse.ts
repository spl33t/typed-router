import { IncomingMessage } from "http";
import { match } from "path-to-regexp";
import { RouteAny } from "../server";

export function paramsParse(route: RouteAny, request: IncomingMessage): Record<any, any> {
  let path = ""
  if (request.url) {
    path = request.url.split("?")[0] || ""
  }
  return path.length > 0 ? match(route.path)(path)["params"] : {}
}