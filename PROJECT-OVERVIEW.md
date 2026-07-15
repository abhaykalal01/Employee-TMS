# Employee TMS - Complete Project Overview

## 📋 Table of Contents
1. [Project Architecture](#project-architecture)
2. [Tech Stack](#tech-stack)
3. [Database Models](#database-models)
4. [Authentication System](#authentication-system)
5. [Real-Time Features](#real-time-features)
6. [API Routes](#api-routes)
7. [Key Components](#key-components)
8. [Email System](#email-system)
9. [Folder Structure](#folder-structure)
10. [Feature Summary](#feature-summary)

---

## 🏗️ Project Architecture

**Framework**: Next.js 16.2.6 with React 19.2.4  
**Rendering**: App Router with Server Components + Client Components  
**Database**: MongoDB with Mongoose ODM  
**Real-Time**: Socket.IO (Custom Node.js server)  
**Authentication**: JWT with HTTP-only cookies  
**Styling**: Tailwind CSS 4 with Custom CSS Variables (Dark/Light Theme)  
**Email**: Nodemailer with Gmail SMTP

### Custom Server Setup
The project uses a custom Node.js server (`server.js`) to integrate Socket.IO with Next.js:
- **Development**: Runs on `localhost:3000`
- **Production**: Runs on `0.0.0.0:3000` (Docker/cloud compatible)
- Socket.IO attached to HTTP server for real-time notifications and task discussions

---

## 🛠️ Tech Stack

```json
{
  "dependencies": {
    "next": "16.2.6",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "mongoose": "^9.6.3",
    "socket.io": "^4.8.3",
    "socket.io-client": "^4.8.3",
    "bcryptjs": "^3.0.3",
    "jsonwebtoken": "^9.0.3",
    "nodemailer": "^9.0.3",
    "lucide-react": "^1.21.0"
  },
  "devDependencies": {
    "tailwindcss": "^4",
    "@tailwindcss/postcss": "^4",
    "eslint": "^9",
    "babel-plugin-react-compiler": "1.0.0"
  }
}
```

---

## 🗄️ Database Models

### 1. User Model (`src/models/User.js`)
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, bcrypt hashed),
  role: String (enum: ['admin', 'employee'], default: 'employee'),
  timestamps: true
}
```

### 2. Task Model (`src/models/Task.js`)
```javascript
{
  title: String (required),
  status: String (enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending'),
  assignedTo: ObjectId (ref: 'User', nullable),
  timestamps: true
}
```

### 3. Notification Model (`src/models/Notification.js`)
```javascript
{
  senderId: ObjectId (ref: 'User', required),
  receiverId: ObjectId (ref: 'User', required),
  senderName: String (required),
  message: String (required),
  type: String (enum: ['task_assigned', 'task_updated', 'task_deleted', 'task_status_updated', 'task_comment']),
  taskId: ObjectId (ref: 'Task', nullable),
  taskTitle: String (nullable),
  isRead: Boolean (default: false),
  readAt: Date (nullable),
  expiresAt: Date (TTL: 2 days - auto-delete),
  timestamps: true
}
```
**Indexes**: 
- `{ receiverId: 1, isRead: 1, createdAt: -1 }` - Efficient unread queries
- `{ receiverId: 1, createdAt: -1 }` - All notifications sorted

### 4. TaskComment Model (`src/models/TaskComment.js`)
```javascript
{
  taskId: ObjectId (ref: 'Task', required, indexed),
  userId: ObjectId (ref: 'User', required),
  userName: String (required),
  userRole: String (enum: ['admin', 'employee'], required),
  message: String (required, trimmed),
  readBy: [{
    userId: ObjectId (ref: 'User'),
    readAt: Date (default: now)
  }],
  timestamps: true
}
```
**Indexes**:
- `{ taskId: 1, createdAt: -1 }` - Task comments sorted
- `{ userId: 1 }` - User's comments

---

## 🔐 Authentication System

### Login Flow (`src/actions/authActions.js`)
1. User submits email + password
2. Server validates credentials with `bcrypt.compare()`
3. JWT token generated with payload: `{ userId, role }` (expires in 1 day)
4. Cookies set:
   - `token` (httpOnly, sameSite: lax) - JWT for auth
   - `userId` (client-accessible) - For Socket.IO and client-side checks
   - `userName` (client-accessible) - Display name
   - `userRole` (client-accessible) - 'admin' or 'employee'
5. Redirect to `/dashboard`

### Authorization
- **`requireAuth()`**: Verifies JWT token, returns user object or throws
- **`requireAdmin()`**: Verifies JWT + checks `role === 'admin'`
- Used in Server Actions for protected operations

### Logout Flow
- Deletes all auth cookies (`token`, `userId`, `userName`, `userRole`)
- Redirects to `/login`

---

## ⚡ Real-Time Features

### Socket.IO Server (`src/lib/socket.js`)

#### Events
1. **`authenticate`** - User joins their notification room
   ```javascript
   socket.emit('authenticate', { userId })
   // Server: socket.join(`user:${userId}`)
   ```

2. **`join-task`** - User joins task discussion room
   ```javascript
   socket.emit('join-task', { taskId, userId })
   // Server: socket.join(`task:${taskId}`)
   ```

3. **`leave-task`** - User leaves task discussion room
   ```javascript
   socket.emit('leave-task', { taskId })
   // Server: socket.leave(`task:${taskId}`)
   ```

4. **`mark-message-read`** - Mark message as read (broadcast to task room)
   ```javascript
   socket.emit('mark-message-read', { taskId, commentId, userId })
   ```

#### Server Emit Functions
- **`emitNotification({ userId, notification })`** - Send notification to specific user
- **`emitTaskComment({ taskId, comment })`** - Broadcast new comment to task room
- **`emitCommentDeleted({ taskId, commentId })`** - Broadcast comment deletion
- **`emitMessageRead({ taskId, commentId, userId })`** - Broadcast read receipt

### Client-Side Socket Usage
- **NotificationBell**: Listens for `notification:new` events
- **TaskDiscussion** (if exists): Listens for `task-comment:new`, `task-comment:deleted`, `message-read`

---

## 🌐 API Routes

### 1. Authentication Routes
- **`POST /api/auth/login`** - Login endpoint (currently unused, uses Server Actions instead)
- **`GET /api/auth/admin`** - Check if user is admin (returns 403 if not)

### 2. Notification Routes (`/api/notifications`)
- **`GET /api/notifications`** - Fetch user notifications (sorted by createdAt desc)
- **`POST /api/notifications`** - Multiple actions:
  - `{ markAllRead: true }` - Mark all notifications as read
  - `{ action: 'mark-read', notificationId }` - Mark single notification as read
  - `{ action: 'delete', notificationId }` - Delete single notification

### 3. Task Comment Routes (`/api/task-comments`)
- **`GET /api/task-comments?taskId=xxx`** - Fetch all comments for a task
- **`POST /api/task-comments`** - Multiple actions:
  - `{ action: 'create', taskId, message }` - Create new comment
  - `{ action: 'mark-read', commentId }` - Mark comment as read
  - `{ action: 'delete', commentId }` - Delete comment (sender or admin only)

### 4. Task Routes (`/api/tasks`)
- **`GET /api/tasks`** - Fetch all tasks with filters/sorting (implementation may vary)

### 5. Socket Route (`/api/socket`)
- WebSocket upgrade endpoint (handled by custom server)

---

## 🧩 Key Components

### 1. **Navbar** (`src/components/Navbar.jsx`)
- Global navigation (shown on all pages)
- Contains:
  - Logo and app title
  - Home/Dashboard links
  - NotificationBell component
  - ThemeToggle component
  - Sign In button
- Fixed at top, glass-morphism effect

### 2. **NotificationBell** (`src/components/NotificationBell.jsx`)
- Real-time notification dropdown
- Features:
  - Unread count badge (shows "99+" if > 99)
  - Click-outside and Escape key to close
  - Mark individual/all as read
  - Delete notifications
  - Navigate to task when clicked
  - Read receipts (✓ Sent, ✓✓ Read)
  - Auto-hides when not authenticated
- Socket.IO: Listens for `notification:new`

### 3. **Sidebar** (`src/components/Sidebar.jsx`)
- Dashboard navigation (inside `/dashboard` layout)
- Role-based menu items:
  - **Admin**: Dashboard, Employees, Tasks, Reports, Settings
  - **Employee**: Dashboard, My Tasks, Settings
- Logout button

### 4. **ThemeToggle** + **ThemeProvider**
- Dark/light mode toggle with localStorage persistence
- CSS variables defined in `globals.css`
- Uses React Context for theme state

### 5. **TaskDiscussion** (Component likely in development)
- Real-time chat inside task detail pages
- Admin + Assigned Employee only
- Features:
  - Send/delete messages
  - Read receipts (✓ Sent, ✓✓ Delivered, Blue ✓✓ Read)
  - Role badges (Admin/Employee)
  - Timestamps

---

## 📧 Email System

### Configuration (`src/lib/mail.js`)
- **SMTP Provider**: Gmail (configurable via env vars)
- **Transporter**: Nodemailer singleton with connection pooling
- **Functions**:
  - `sendEmail({ to, subject, html })` - Async email sender
  - `queueEmail(options)` - Fire-and-forget (non-blocking)

### Email Templates (`src/lib/emailTemplates.js`)
1. **Welcome Email** - Sent when employee is created
2. **Task Assigned Email** - Sent when admin assigns task
3. **Task Status Changed Email** - Sent when status changes
4. **Password Reset Email** - Secure token-based reset (requires token generation)
5. **Role Changed Email** - Sent when admin changes employee role

### Email Sending Points
- **Employee created**: Welcome email
- **Task assigned**: Notification to employee
- **Task status changed**: 
  - Admin changes → email to employee
  - Employee changes → email to all admins
- **Password reset**: Token-based link (requires implementation)
- **Role changed**: Notification email (requires implementation)

---

## 📁 Folder Structure

```
employee-tms/
├── .env.local                 # Environment variables (MongoDB, JWT, SMTP)
├── server.js                  # Custom Node.js server (Socket.IO + Next.js)
├── package.json               # Dependencies and scripts
├── next.config.mjs            # Next.js configuration
├── tailwind.config.js         # Tailwind CSS config
├── public/                    # Static assets (SVGs, images)
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── layout.js          # Root layout (Navbar, ThemeProvider)
│   │   ├── page.js            # Home page (landing)
│   │   ├── login/             # Login page
│   │   ├── forgot-password/   # Password reset page
│   │   ├── reset-password/    # Reset password form
│   │   ├── dashboard/         # Dashboard (protected)
│   │   │   ├── layout.js      # Dashboard layout (Sidebar, auth check)
│   │   │   ├── page.js        # Dashboard home (stats)
│   │   │   ├── employees/     # Employee CRUD pages
│   │   │   ├── tasks/         # Task CRUD pages
│   │   │   ├── my-tasks/      # Employee's assigned tasks
│   │   │   ├── reports/       # Reports page
│   │   │   └── settings/      # Settings (profile, password, notifications, theme)
│   │   └── api/               # API routes
│   │       ├── auth/          # Auth endpoints
│   │       ├── notifications/ # Notification endpoints
│   │       ├── task-comments/ # Task comment endpoints
│   │       ├── tasks/         # Task endpoints
│   │       └── socket/        # Socket.IO upgrade
│   ├── components/            # React components
│   │   ├── Navbar.jsx         # Global navbar
│   │   ├── Sidebar.jsx        # Dashboard sidebar
│   │   ├── NotificationBell.jsx # Real-time notifications
│   │   ├── ThemeToggle.jsx    # Dark/light mode toggle
│   │   ├── ThemeProvider.jsx  # Theme context provider
│   │   └── ThemeInit.jsx      # SSR theme initialization
│   ├── actions/               # Server Actions
│   │   ├── authActions.js     # Login/logout
│   │   ├── employeeActions.js # Employee CRUD
│   │   ├── taskActions.js     # Task CRUD + status updates
│   │   └── passwordResetActions.js # Password reset logic
│   ├── lib/                   # Utility libraries
│   │   ├── db.js              # MongoDB connection
│   │   ├── auth.js            # Auth utilities (requireAuth, requireAdmin)
│   │   ├── getCurrentUser.js  # Server-side user fetcher
│   │   ├── socket.js          # Socket.IO server setup
│   │   ├── notifications.js   # Notification CRUD + emit
│   │   ├── mail.js            # Email sender (Nodemailer)
│   │   └── emailTemplates.js  # HTML email templates
│   ├── models/                # Mongoose models
│   │   ├── User.js            # User/Employee model
│   │   ├── Task.js            # Task model
│   │   ├── Notification.js    # Notification model (TTL index)
│   │   └── TaskComment.js     # Task comment model
│   └── services/              # Business logic services
│       └── taskCommentService.js # Task comment access control
└── node_modules/
```

---

## ✨ Feature Summary

### 🔑 Authentication & Authorization
- ✅ JWT-based authentication with HTTP-only cookies
- ✅ Role-based access control (Admin vs Employee)
- ✅ Protected routes (dashboard requires auth)
- ✅ Password hashing with bcrypt
- 🚧 Password reset (token-based, partially implemented)

### 👥 Employee Management (Admin Only)
- ✅ Create employee (sends welcome email)
- ✅ View all employees
- ✅ Edit employee details
- ✅ Delete employee
- ✅ Change employee role (triggers email notification)

### 📋 Task Management
- ✅ Create task (admin only, sends email if assigned)
- ✅ Assign task to employee
- ✅ Update task details (admin only)
- ✅ Delete task (admin only)
- ✅ Change task status:
  - Admin can change any task status
  - Employee can only change their assigned tasks
  - Status change triggers email notifications
- ✅ Task filtering by status/employee
- ✅ "My Tasks" view for employees

### 🔔 Real-Time Notifications
- ✅ Socket.IO integration for live updates
- ✅ Notification types:
  - Task assigned
  - Task updated
  - Task deleted
  - Task status changed
  - Task comments (if implemented)
- ✅ Unread count badge (99+ cap)
- ✅ Mark as read (individual + bulk)
- ✅ Delete notifications
- ✅ Auto-expire after 2 days (MongoDB TTL index)
- ✅ Read receipts (✓ Sent, ✓✓ Read)
- ✅ Click notification to navigate to task

### 💬 Task Discussion System (Partial Implementation)
- ✅ Real-time chat inside task pages
- ✅ Access control (Admin + Assigned Employee only)
- ✅ Message CRUD (create, delete own messages, admin can delete any)
- ✅ Read receipts with `readBy` array
- ✅ Socket.IO rooms per task (`task:${taskId}`)
- ✅ Role badges (Admin/Employee)
- 🚧 UI component (TaskDiscussion.jsx) - may need verification

### 📧 Email Notifications
- ✅ Nodemailer integration with Gmail SMTP
- ✅ Email templates:
  - Welcome email (employee creation)
  - Task assigned email
  - Task status changed email
  - Password reset email (token-based)
  - Role changed email (partially implemented)
- ✅ Fire-and-forget queue system (non-blocking)
- ✅ Graceful failure handling

### 🎨 UI/UX Features
- ✅ Dark/light theme toggle with persistence
- ✅ Responsive design (mobile + desktop)
- ✅ Glass-morphism effects
- ✅ Gradient accents
- ✅ Lucide React icons
- ✅ Loading states and error handling
- ✅ Click-outside and Escape key for modals/dropdowns
- ✅ Inline validation errors (login form)
- ✅ Smooth transitions and animations

### 📊 Dashboard & Reports
- ✅ Dashboard overview page (stats)
- ✅ Task statistics
- ✅ Activity feed (real-time)
- 🚧 Reports page (may need more implementation)

### ⚙️ Settings
- ✅ Profile settings (edit name, email)
- ✅ Change password
- ✅ Theme preferences (dark/light)
- ✅ Notification preferences (placeholder)

---

## 🚀 Running the Project

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Gmail account with App Password (for SMTP)

### Setup
1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables** (`.env.local`):
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   JWT_SECRET=your-secret-key
   NODE_ENV=development
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   # SMTP
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM_NAME="Employee TMS"
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```
   - Opens at `http://localhost:3000`
   - Socket.IO server attached automatically

4. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

---

## 🔒 Security Considerations

### Implemented
- ✅ HTTP-only cookies for JWT
- ✅ Password hashing with bcrypt (salt rounds: 10)
- ✅ JWT expiration (1 day)
- ✅ Role-based authorization checks
- ✅ Server-side validation in all Server Actions
- ✅ Mongoose schema validation
- ✅ CORS configuration for Socket.IO

### Recommendations
- 🔐 Add rate limiting (login attempts, API calls)
- 🔐 Implement CSRF protection
- 🔐 Add input sanitization for XSS prevention
- 🔐 Use HTTPS in production
- 🔐 Rotate JWT secret regularly
- 🔐 Add password complexity requirements
- 🔐 Implement 2FA (optional)
- 🔐 Add audit logs for admin actions

---

## 🐛 Known Issues / TODOs

1. **Password Reset**: Token generation and validation partially implemented
2. **TaskDiscussion Component**: May need verification/completion
3. **Role Change Email**: Template exists but trigger point may be missing
4. **Reports Page**: May need more implementation
5. **Error Handling**: Some API routes could have better error messages
6. **Validation**: Client-side validation could be more comprehensive
7. **Testing**: No unit/integration tests yet
8. **Performance**: Consider pagination for tasks/notifications (currently loads all)
9. **Accessibility**: ARIA labels could be more comprehensive
10. **Notification Bell**: May show briefly on home page before auth check completes (hydration issue)

---

## 📚 Key Technologies & Patterns

### Architecture Patterns
- **Server-Side Rendering (SSR)**: Next.js App Router with Server Components
- **Server Actions**: Form submissions without API routes
- **Real-Time Updates**: Socket.IO for live notifications and chat
- **Repository Pattern**: Mongoose models as data layer
- **Service Layer**: Business logic in `src/services/`
- **Middleware Pattern**: Auth checks in layouts and actions

### State Management
- **Server State**: React Server Components (no client state)
- **Client State**: React hooks (useState, useEffect, useContext)
- **Theme State**: React Context + localStorage

### Code Organization
- **Colocation**: Components near their usage (page-level components)
- **Shared Components**: `src/components/` for reusable UI
- **Utilities**: `src/lib/` for non-UI logic
- **Actions**: `src/actions/` for server-side mutations

---

## 🎯 Summary

**Employee TMS** is a production-ready task management system with:
- **Role-based access control** (Admin vs Employee)
- **Real-time notifications** via Socket.IO
- **Email notifications** via Nodemailer
- **Task assignment and tracking** with status updates
- **Dark/light theme** with CSS variables
- **Responsive design** for mobile and desktop
- **MongoDB** for data persistence with TTL indexes
- **JWT authentication** with secure cookie storage

**Tech Highlights**:
- Next.js 16 with React 19 (React Compiler enabled)
- Socket.IO for real-time features
- Server Actions for form handling
- Mongoose for MongoDB ORM
- Tailwind CSS 4 for styling

This project is well-structured, follows modern Next.js best practices, and implements production-level features like real-time updates, email notifications, and secure authentication.

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Author**: Your Team Name
