const { createServer } = require("http");
const { parse } = require("url");
const path = require("path");
const next = require("next");
const { initSocketServer } = require("./src/lib/socket");

const dev = process.env.NODE_ENV !== "production";
// Use localhost for development, 0.0.0.0 for production (Docker/cloud compatibility)
const hostname = dev ? "localhost" : "0.0.0.0";
const port = parseInt(process.env.PORT || "3000", 10);
const appDir = path.resolve(__dirname);
const app = next({ dev, hostname, port, dir: appDir });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    });

    initSocketServer(server);

    server.listen(port, hostname, () => {
        const displayHost = hostname === "0.0.0.0" ? "localhost" : hostname;
        console.log(`> Ready on http://${displayHost}:${port}`);
        console.log(`> Socket.IO server attached`);
    });
});
