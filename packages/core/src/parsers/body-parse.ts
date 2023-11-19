import { IncomingMessage } from "http";

export function bodyParse(request: IncomingMessage): Promise<Record<any, any>> {
  return new Promise((resolve) => {
    const bodyParts: any[] = []
    let body: Record<any, any> = {}
    request.on('data', (chunk) => {
      bodyParts.push(chunk);
    }).on('end', () => {
      if (bodyParts.length > 0 && isJsonString(bodyParts.toString()))
        body = JSON.parse(Buffer.concat(bodyParts).toString())
      resolve(body)
    });
  });
}

function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}