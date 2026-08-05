const { defineConfig } = require("vite");
const vue = require("@vitejs/plugin-vue");

const apiRoutes = {
  "/api/spread": require("./api/spread"),
  "/api/reading": require("./api/reading"),
  "/api/rings": require("./api/rings"),
  "/api/ring-events": require("./api/ring-events"),
  "/api/sign-ring": require("./api/sign-ring"),
  "/api/verify-ring": require("./api/verify-ring"),
};

function localApiPlugin() {
  return {
    name: "local-api-plugin",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathname = req.url ? req.url.split("?")[0] : "";
        const handler = apiRoutes[pathname];

        if (!handler) {
          next();
          return;
        }

        try {
          const parsedUrl = new URL(req.url, "http://localhost");
          req.query = Object.fromEntries(parsedUrl.searchParams.entries());

          res.status = (code) => {
            res.statusCode = code;
            return res;
          };

          let rawBody = "";
          await new Promise((resolve, reject) => {
            req.on("data", (chunk) => {
              rawBody += chunk;
            });
            req.on("end", resolve);
            req.on("error", reject);
          });
          req.body = rawBody;

          await handler(req, res);
        } catch (error) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              ok: false,
              error: error instanceof Error ? error.message : "Local API failed",
            }),
          );
        }
      });
    },
  };
}

module.exports = defineConfig({
  plugins: [vue(), localApiPlugin()],
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("@supabase/supabase-js")) return "supabase";
          if (id.includes("vue-router")) return "router";
          if (id.includes("/vue/")) return "vue-core";
        },
      },
    },
  },
});
