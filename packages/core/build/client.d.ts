import { IsRoute, RouteAny } from "./server";
type FetcherInput = Pick<RouteAny, "body" | "method" | "query" | "path">;
type ClientHandlers<R extends Record<any, any>> = {
    [Key in keyof R]: IsRoute<R[Key]> extends true ? ClientHandler<R[Key]> : ClientHandlers<R[Key]>;
};
type ClientHandlerArgs<R extends RouteAny, P extends Parameters<R["handler"]>[0] = Parameters<R["handler"]>[0]> = {
    [Key in keyof P as Key extends "query" | "body" | "params" ? Key : never]: P[Key];
};
type ClientHandler<R extends RouteAny> = (arg: ClientHandlerArgs<R>) => Promise<ReturnType<R["handler"]>>;
export declare function initClient<Router extends {
    [key: string]: Record<any, any> | RouteAny;
}>(_router: Router, mapFetcher: (args: FetcherInput) => Promise<any>): ClientHandlers<Router>;
export {};
//# sourceMappingURL=client.d.ts.map