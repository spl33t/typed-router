import { match } from "path-to-regexp";
export function paramsParse(route, request) {
    let path = "";
    if (request.url) {
        path = request.url.split("?")[0] || "";
    }
    return path.length > 0 ? match(route.path)(path)["params"] : {};
}
//# sourceMappingURL=params-parse.js.map