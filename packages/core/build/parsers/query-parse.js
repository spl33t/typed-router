import qs from "qs";
export function queryParse(request) {
    let queryString = "";
    if (request.url) {
        queryString = request.url.split("?")[1] || "";
    }
    return queryString.length > 0 ? qs.parse(queryString) : {};
}
//# sourceMappingURL=query-parse.js.map