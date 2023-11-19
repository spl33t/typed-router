import { bodyParse } from "./parsers/body-parse";
import { queryParse } from "./parsers/query-parse";
import { paramsParse } from "./parsers/params-parse";
import { routeMatch } from "./route-match";
export function isRoute(val) {
    return Boolean(val["method"]);
}
export function initServer(context) {
    class RouteBuilder {
        route = {};
        path(_path) {
            this.route["path"] = (!_path.startsWith("/") ? `/${_path}` : _path);
            return this;
        }
        method(_method) {
            this.route["method"] = _method;
            return this;
        }
        body(_body) {
            this.route["body"] = _body;
            return this;
        }
        query(_query) {
            this.route["query"] = _query;
            return this;
        }
        // THIS as Отвечает за вывод типа роутов
        handler(_handler) {
            this.route["handler"] = _handler;
            return this["route"];
        }
    }
    function route() {
        return new RouteBuilder();
    }
    const declareSchema = function () { };
    function createRouter(router, req, res) {
        const routes = {};
        function extractRoutes(router) {
            for (const routerKey in router) {
                const recordOrRoute = router[routerKey];
                if (recordOrRoute.method) {
                    if (!routes[recordOrRoute.path + recordOrRoute.method]) {
                        routes[recordOrRoute.path + recordOrRoute.method] = recordOrRoute;
                    }
                    else {
                        throw new Error("Two equal route");
                    }
                }
                else {
                    extractRoutes(recordOrRoute);
                }
            }
        }
        extractRoutes(router);
        async function routesHandle() {
            try {
                const route = routeMatch(routes, req);
                if (route) {
                    req.params = paramsParse(route, req);
                    req.body = await bodyParse(req);
                    req.query = queryParse(req);
                    let response = await route.handler({ ...req, ...(context !== undefined && context(req, res)) });
                    res.writeHead(200, { "Content-Type": "application/json" });
                    response && res.write(JSON.stringify(response));
                    res.end();
                    return { status: 200 };
                }
                else {
                    return { status: 404, message: "route not found" };
                }
            }
            catch (err) {
                console.log(err);
                return { status: 500, message: err.message };
            }
        }
        return routesHandle();
    }
    return { route, createRouter, declareSchema };
}
//# sourceMappingURL=server.js.map