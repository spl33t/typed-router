/// <reference types="node" />
import { IncomingMessage } from "http";
import { RouteAny } from "./server";
export declare function routeMatch(routes: Record<any, RouteAny>, request: IncomingMessage): RouteAny | null;
//# sourceMappingURL=route-match.d.ts.map