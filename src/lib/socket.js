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
        // User authentication
        socket.on("authenticate", ({ userId }) => {
            if (!userId) {
                return;
            }
            socket.userId = userId;
            socket.join(`user:${userId}`);
        });

        // Join task discussion room
        socket.on("join-task", ({ taskId, userId }) => {
            if (!taskId || !userId) {
                return;
            }
            socket.join(`task:${taskId}`);
        });

        // Leave task discussion room
        socket.on("leave-task", ({ taskId }) => {
            if (!taskId) {
                return;
            }
            socket.leave(`task:${taskId}`);
        });

        // Mark message as read
        socket.on("mark-message-read", ({ taskId, commentId, userId }) => {
            if (!taskId || !commentId || !userId) {
                return;
            }
            // Broadcast read receipt to task room
            socket.to(`task:${taskId}`).emit("message-read", { commentId, userId });
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

function emitTaskComment({ taskId, comment }) {
    if (!io) {
        return;
    }

    io.to(`task:${taskId}`).emit("task-comment:new", comment);
}

function emitCommentDeleted({ taskId, commentId }) {
    if (!io) {
        return;
    }

    io.to(`task:${taskId}`).emit("task-comment:deleted", { commentId });
}

function emitMessageRead({ taskId, commentId, userId }) {
    if (!io) {
        return;
    }

    io.to(`task:${taskId}`).emit("message-read", { commentId, userId });
}

module.exports = {
    initSocketServer,
    getSocketServer,
    emitNotification,
    emitTaskComment,
    emitCommentDeleted,
    emitMessageRead,
};
