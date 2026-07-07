# 🏗️ Server Architecture - Employee TMS

## Why We Use a Custom Server

### The Problem
Next.js by default runs its own server that handles all HTTP requests. However, **Socket.IO requires direct access to the HTTP server instance** to enable real-time WebSocket connections.

### The Solution
We use a custom Node.js server (`server.js`) that:
1. Creates an HTTP server
2. Passes it to Next.js for handling routes
3. Attaches Socket.IO to the same server for WebSocket support

This allows **both HTTP and WebSocket protocols** to coexist on the same port.

---

## Custom Server Configuration

### Development vs Production

```javascript
// server.js
const dev = process.env.NODE_ENV !== "production";
const hostname = dev ? "localhost" : "0.0.0.0";
```

**Why this matters:**

| Environment | Hostname | Reason |
|------------|----------|--------|
| **Development** | `localhost` | Best for local development, clearer logs, browser compatibility |
| **Production** | `0.0.0.0` | Required for Docker containers and cloud deployments to accept external connections |

### What `0.0.0.0` means:
- Binds to **all network interfaces**
- Allows connections from any IP address
- Essential for Docker/Kubernetes where container IPs are dynamic
- Displayed as `localhost` in logs for user-friendliness

---

## Socket.IO Integration

### Server-Side (`src/lib/socket.js`)
```javascript
const { Server } = require("socket.io");

function initSocketServer(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: allowedOrigins,
            methods: ["GET", "POST"],
            credentials: true,
        },
    });
    
    io.on("connection", (socket) => {
        socket.on("authenticate", ({ userId }) => {
            socket.join(`user:${userId}`);
        });
    });
}
```

### Client-Side (`src/components/NotificationBell.jsx`)
```javascript
const socket = io("http://localhost:3000", { transports: ["websocket"] });
socket.on("connect", () => {
    socket.emit("authenticate", { userId });
});

socket.on("notification:new", (notification) => {
    // Handle real-time notification
});
```

### How It Works
1. User logs in → JWT stored in cookie
2. Client opens WebSocket connection
3. Client sends `authenticate` event with userId
4. Server joins socket to user-specific room: `user:${userId}`
5. When events occur (task assigned, etc.), server emits to that room
6. Only that specific user receives the notification

---

## Next.js 16 Proxy (Middleware Migration)

### What Changed

**Next.js 15 and earlier:**
```javascript
// src/middleware.js
export function middleware(request) {
    // Route protection logic
}
```

**Next.js 16:**
```javascript
// src/proxy.js
export function proxy(request) {
    // Route protection logic
}
```

### Why "Proxy" Instead of "Middleware"?

Next.js 16 clarifies terminology:
- **Proxy** = Request interceptor (runs before route handlers)
- **Middleware** = Now reserved for actual middleware patterns

The functionality is **identical**, just renamed for clarity.

### Our Implementation
```javascript
// src/proxy.js
export function proxy(request) {
    const token = request.cookies.get("token")?.value;
    const role = getRoleFromToken(token) || "employee";
    
    // Admin-only routes
    if (role !== "admin" && isAdminOnlyPath(pathname)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};
```

---

## File Structure

```
employee-tms/
├── server.js                    # Custom Node.js server with Socket.IO
├── src/
│   ├── proxy.js                 # Next.js 16 route protection (auth/rbac)
│   ├── lib/
│   │   ├── socket.js            # Socket.IO server initialization
│   │   └── notifications.js     # Notification service (uses Socket.IO)
│   ├── components/
│   │   └── NotificationBell.jsx # Socket.IO client connection
│   └── actions/
│       ├── taskActions.js       # Emits real-time notifications
│       └── employeeActions.js   # Emits real-time notifications
└── package.json
```

---

## Scripts Explanation

### `package.json`
```json
{
  "scripts": {
    "dev": "node server.js",
    "build": "next build",
    "start": "node server.js",
    "lint": "eslint"
  }
}
```

**Why not `next dev`?**
- `next dev` would start Next.js's built-in server
- We need our custom server to attach Socket.IO
- `node server.js` starts our custom server which includes Next.js + Socket.IO

**Production deployment:**
1. `npm run build` - Builds Next.js production bundle
2. `npm start` - Runs custom server with `NODE_ENV=production`

---

## Alternative Approaches (Why We Didn't Use Them)

### ❌ Option 1: Next.js API Routes + Polling
**Problem:** Requires constant HTTP requests every few seconds
- Wastes bandwidth
- Higher server load
- Delayed notifications (polling interval)

### ❌ Option 2: External WebSocket Server
**Problem:** Requires separate deployment and port
- More complex infrastructure
- CORS configuration needed
- Additional monitoring required

### ✅ Option 3: Custom Server + Socket.IO (Our Choice)
**Benefits:**
- Single port (3000) for everything
- Real-time, bidirectional communication
- Minimal latency
- Clean integration
- One deployment target

---

## Development Workflow

### Starting the Server
```bash
npm run dev
```

**What happens:**
1. Node.js executes `server.js`
2. Custom server starts on `localhost:3000`
3. Next.js attaches its request handler
4. Socket.IO attaches to the same server
5. Both HTTP and WebSocket work on port 3000

### Logs You'll See
```
> Ready on http://localhost:3000
> Socket.IO server attached
```

### Testing WebSocket Connection
1. Login to the application
2. Open browser DevTools → Network → WS (WebSocket)
3. You should see active WebSocket connection to `ws://localhost:3000/`
4. Create a task or assign it to someone
5. Watch real-time notification appear without page refresh

---

## Production Considerations

### Docker Deployment
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci --production
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Server will bind to `0.0.0.0:3000` inside container, accessible via container port mapping.

### Environment Variables
```env
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_SOCKET_URL=https://your-domain.com
```

### Load Balancing
If using multiple instances, consider:
- Redis adapter for Socket.IO (`@socket.io/redis-adapter`)
- Session affinity (sticky sessions) on load balancer
- Shared session store (Redis/MongoDB)

---

## Troubleshooting

### Issue: "Socket connection failed"
**Check:**
- Server is running (`npm run dev`)
- Port 3000 is not blocked by firewall
- No other service using port 3000
- Browser console for WebSocket errors

### Issue: "Middleware deprecation warning"
**Solution:** Already fixed! We renamed `middleware.js` → `proxy.js` and exported `proxy` function.

### Issue: "Can't connect from other devices on network"
**For development testing:**
1. Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Temporarily change server.js: `hostname = "0.0.0.0"`
3. Access from other device: `http://192.168.x.x:3000`
4. Revert to `localhost` after testing

---

## Key Takeaways

✅ **Custom server IS required** - Socket.IO needs HTTP server access  
✅ **Development uses `localhost`** - Better logs, no confusion  
✅ **Production uses `0.0.0.0`** - Docker/cloud compatibility  
✅ **proxy.js (not middleware.js)** - Next.js 16 convention  
✅ **Single port for everything** - HTTP + WebSocket on 3000  
✅ **Real-time notifications** - No polling, instant updates  

---

## References

- [Next.js Custom Server](https://nextjs.org/docs/pages/building-your-application/configuring/custom-server)
- [Socket.IO with Next.js](https://socket.io/how-to/use-with-nextjs)
- [Next.js 16 Proxy Migration](https://nextjs.org/docs/messages/middleware-to-proxy)
- [Node.js HTTP Server](https://nodejs.org/api/http.html#httpcreateserveroptions-requestlistener)

---

**Your setup is production-ready!** The custom server architecture supports both development and production environments seamlessly.
