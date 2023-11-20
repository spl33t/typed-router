import http from "http";
import { createRouter } from "./router/init"
import { router } from "./router";

const httpServerPort = 8100
http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') {
    console.log("options")
    res.writeHead(200);
    res.end();
    return;
  }
  createRouter(router, req, res).then(s => {
    if (s.status !== 200) {
      res.writeHead(s.status, { "Content-Type": "application/json" });
      res.write(JSON.stringify(s));
      res.end()
    }
  })
}).listen(httpServerPort, () => console.log(`http server started on ${httpServerPort}`))
