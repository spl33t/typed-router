import { insertParamsIntoPath } from "./paths";
import { isRoute } from "./server";
export function initClient(_router, mapFetcher) {
    const get = (t, path) => path.reduce((r, k) => r?.[k], t);
    function clientHandlersBuild(rec, keys = []) {
        for (const key in rec) {
            const route = rec[key];
            if (!isRoute(route)) {
                clientHandlersBuild(route, [...keys, key]);
            }
            else {
                get(_router, keys)[key] = (args) => mapFetcher({
                    method: route.method,
                    ...(args.query && { query: args.query }),
                    ...(route.method !== "GET" && { body: args.body }),
                    path: insertParamsIntoPath({ path: `${route.path}`, params: args.params })
                });
            }
        }
    }
    clientHandlersBuild(_router);
    return _router;
}
//# sourceMappingURL=client.js.map