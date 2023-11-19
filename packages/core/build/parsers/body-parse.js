export function bodyParse(request) {
    return new Promise((resolve) => {
        const bodyParts = [];
        let body = {};
        request.on('data', (chunk) => {
            bodyParts.push(chunk);
        }).on('end', () => {
            if (bodyParts.length > 0 && isJsonString(bodyParts.toString()))
                body = JSON.parse(Buffer.concat(bodyParts).toString());
            resolve(body);
        });
    });
}
function isJsonString(str) {
    try {
        JSON.parse(str);
    }
    catch (e) {
        return false;
    }
    return true;
}
//# sourceMappingURL=body-parse.js.map