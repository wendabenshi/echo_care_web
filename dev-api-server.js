const http = require("http");
const { URL } = require("url");

const routes = {
  "/api/spread": require("./api/spread"),
  "/api/reading": require("./api/reading"),
  "/api/rings": require("./api/rings"),
  "/api/ring-events": require("./api/ring-events"),
  "/api/sign-ring": require("./api/sign-ring"),
  "/api/verify-ring": require("./api/verify-ring"),
};

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function collectBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
    });
    req.on("end", () => {
      resolve(raw);
    });
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, "http://localhost:3002");
  const handler = routes[requestUrl.pathname];

  if (!handler) {
    sendJson(res, 404, { ok: false, error: "Not found" });
    return;
  }

  try {
    const rawBody = await collectBody(req);
    const query = Object.fromEntries(requestUrl.searchParams.entries());

    req.query = query;
    req.body = rawBody;
    res.status = (code) => {
      res.statusCode = code;
      return res;
    };

    await handler(req, res);
  } catch (error) {
    sendJson(res, 500, {
      ok: false,
      error: error instanceof Error ? error.message : "Local API server failed",
    });
  }
});

const port = Number(process.env.LOCAL_API_PORT || 3002);
const host = "127.0.0.1";

server.listen(port, host, () => {
  console.log(`Local API server running at http://${host}:${port}`);
});
