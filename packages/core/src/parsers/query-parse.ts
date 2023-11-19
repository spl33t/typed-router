import { IncomingMessage } from "http";
import qs from "qs";

export function queryParse(request: IncomingMessage) {
  let queryString = ""
  if (request.url) {
    queryString = request.url.split("?")[1] || ""
  }
  return queryString.length > 0 ? qs.parse(queryString) : {}
}