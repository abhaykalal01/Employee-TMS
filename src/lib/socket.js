const { Server } = require("socket.io");

let io;

function initSocketServer(httpServer) {
    if (io) {
        return io;
    }

    const allowedOrigins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        process.env.NEXT_PUBLIC_APP_URL,
    ].filter(Boolean);

    io = new Server(httpServer, {
        cors: {
            origin: (origin, callback) => {
                if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, true);
                    return;
                }
                callback(new Error("Not allowed by CORS"));
            },
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        socket.on("authenticate", ({ userId }) => {
            if (!userId) {
                return;
            }
            socket.join(`user:${userId}`);
        });
    });

    return io;
}

function getSocketServer() {
    return io;
}

function emitNotification({ userId, notification }) {
    if (!io) {
        return;
    }

    io.to(`user:${userId}`).emit("notification:new", notification);
}

module.exports = {
    initSocketServer,
    getSocketServer,
    emitNotification,
};
