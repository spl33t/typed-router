//type test = ParamsFromUrl<"">
//let test: ParamsFromUrl<"sas">
export const insertParamsIntoPath = ({ path, params, }) => {
    return path
        .replace(/:([^/]+)/g, (_, p) => {
        return params[p] || '';
    })
        .replace(/\/\//g, '/');
};
//const test2 = insertParamsIntoPath({ path: "sas/:id/:nice", params: { id: "", nice: "" } })
//# sourceMappingURL=paths.js.map