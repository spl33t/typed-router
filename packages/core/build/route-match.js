import { pathToRegexp } from "path-to-regexp";
export function routeMatch(routes, request) {
    let requestPath = "";
    if (request.url)
        requestPath = request.url.split("?")[0];
    return Object.values(routes).filter(route => pathToRegexp(route.path).test(requestPath) && route.method === request.method)[0] || null;
}
//# sourceMappingURL=route-match.js.map