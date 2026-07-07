const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// A beautiful, responsive base layout with a dark theme aesthetic matching the TMS dashboard.
function baseLayout(content) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Employee TMS</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            background-color: #020617;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #f8fafc;
            -webkit-font-smoothing: antialiased;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
          }
          .card {
            background-color: #0f172a;
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 16px;
            padding: 32px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          }
          .header {
            margin-bottom: 24px;
            text-align: center;
          }
          .logo {
            font-size: 20px;
            font-weight: 700;
            background: linear-gradient(135deg, #7c3aed, #2563eb);
            -webkit-background-clip: text;
            color: #7c3aed;
            text-decoration: none;
            letter-spacing: -0.02em;
          }
          .title {
            font-size: 22px;
            font-weight: 700;
            margin: 20px 0 10px;
            color: #f8fafc;
            letter-spacing: -0.01em;
          }
          .content {
            font-size: 15px;
            line-height: 1.6;
            color: #94a3b8;
            margin-bottom: 30px;
          }
          .button {
            display: inline-block;
            background: linear-gradient(135deg, #7c3aed, #2563eb);
            color: #ffffff !important;
            text-decoration: none;
            font-size: 14px;
            font-weight: 600;
            padding: 12px 24px;
            border-radius: 10px;
            box-shadow: 0 10px 20px -10px rgba(124, 58, 237, 0.5);
            text-align: center;
          }
          .footer {
            margin-top: 32px;
            text-align: center;
            font-size: 12px;
            color: #64748b;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            padding-top: 20px;
          }
          .highlight {
            color: #c4b5fd;
            font-weight: 600;
          }
          .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 700;
            background-color: rgba(124, 58, 237, 0.15);
            color: #c4b5fd;
            border: 1px solid rgba(124, 58, 237, 0.3);
            text-transform: uppercase;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="header">
              <span class="logo">EMPLOYEE TMS</span>
            </div>
            ${content}
            <div class="footer">
              This is an automated notification from Employee TMS.<br>
              &copy; 2026 Employee TMS. All rights reserved.
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

// 1. Welcome email template
export function welcomeEmailTemplate({ name, email, tempPassword }) {
  const content = `
    <h2 class="title">Welcome to the Team, ${name}!</h2>
    <div class="content">
      <p>An account has been created for you on the <strong>Employee TMS</strong> platform.</p>
      <p>Here are your login credentials:</p>
      <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #64748b; width: 100px;">Email:</td>
          <td style="padding: 8px 0; color: #f8fafc; font-weight: 600;">${email}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #64748b;">Password:</td>
          <td style="padding: 8px 0; color: #f8fafc; font-weight: 600; font-family: monospace;">${tempPassword}</td>
        </tr>
      </table>
      <p style="margin-top: 24px;">Please click the button below to sign in and update your password in Settings.</p>
      <div style="text-align: center; margin: 30px 0 10px;">
        <a href="${appUrl}/login" class="button" target="_blank">Sign In to Dashboard</a>
      </div>
    </div>
  `;
  return {
    subject: "Welcome to Employee TMS - Account Created",
    html: baseLayout(content),
  };
}

// 2. Task assignment email template
export function taskAssignedEmailTemplate({ employeeName, taskTitle, creatorName }) {
  const content = `
    <h2 class="title">New Task Assigned</h2>
    <div class="content">
      <p>Hello <span class="highlight">${employeeName}</span>,</p>
      <p><span class="highlight">${creatorName}</span> has assigned you a new task: <strong style="color: #f8fafc;">${taskTitle}</strong>.</p>
      <p>Please review the details and update its status as you progress.</p>
      <div style="text-align: center; margin: 30px 0 10px;">
        <a href="${appUrl}/dashboard/my-tasks" class="button" target="_blank">View My Tasks</a>
      </div>
    </div>
  `;
  return {
    subject: `New Task Assigned: ${taskTitle}`,
    html: baseLayout(content),
  };
}

// 3. Task status updated email template
export function taskStatusChangedEmailTemplate({ recipientName, taskTitle, oldStatus, newStatus, actorName }) {
  const content = `
    <h2 class="title">Task Status Updated</h2>
    <div class="content">
      <p>Hello <span class="highlight">${recipientName}</span>,</p>
      <p>The status of the task <strong>"${taskTitle}"</strong> has been updated by <span class="highlight">${actorName}</span>.</p>
      <div style="margin: 20px 0; padding: 16px; background-color: rgba(255, 255, 255, 0.03); border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.05);">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; color: #64748b; width: 120px;">Previous Status:</td>
            <td style="padding: 6px 0; color: #fca5a5; text-decoration: line-through;">${oldStatus}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">New Status:</td>
            <td style="padding: 6px 0; color: #86efac; font-weight: 700;">${newStatus}</td>
          </tr>
        </table>
      </div>
      <div style="text-align: center; margin: 30px 0 10px;">
        <a href="${appUrl}/dashboard" class="button" target="_blank">Go to Console</a>
      </div>
    </div>
  `;
  return {
    subject: `Task Status Updated: ${taskTitle}`,
    html: baseLayout(content),
  };
}

// 4. Password reset email template
export function passwordResetEmailTemplate({ name, resetToken }) {
  const resetUrl = `${appUrl}/reset-password?token=${resetToken}`;
  const content = `
    <h2 class="title">Password Reset Request</h2>
    <div class="content">
      <p>Hello <span class="highlight">${name}</span>,</p>
      <p>We received a request to reset the password for your Employee TMS account.</p>
      <p>Click the button below to set a new password. This link is only valid for <strong>1 hour</strong>.</p>
      <div style="text-align: center; margin: 30px 0 10px;">
        <a href="${resetUrl}" class="button" target="_blank">Reset Password</a>
      </div>
      <p style="font-size: 13px; color: #64748b; margin-top: 24px;">If you did not request a password reset, you can safely ignore this email.</p>
    </div>
  `;
  return {
    subject: "Reset your Employee TMS Password",
    html: baseLayout(content),
  };
}

// 5. Role changed email template
export function roleChangedEmailTemplate({ name, oldRole, newRole, actorName }) {
  const content = `
    <h2 class="title">Account Role Changed</h2>
    <div class="content">
      <p>Hello <span class="highlight">${name}</span>,</p>
      <p>Your account access role has been updated by <span class="highlight">${actorName}</span>.</p>
      <div style="margin: 20px 0; padding: 16px; background-color: rgba(255, 255, 255, 0.03); border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">
        <span class="badge" style="background-color: rgba(239, 68, 68, 0.1); color: #fca5a5; border-color: rgba(239, 68, 68, 0.25); text-decoration: line-through; margin-right: 10px;">${oldRole}</span>
        <span style="color: #94a3b8; font-size: 18px;">&rarr;</span>
        <span class="badge" style="background-color: rgba(52, 211, 153, 0.1); color: #86efac; border-color: rgba(52, 211, 153, 0.25); margin-left: 10px;">${newRole}</span>
      </div>
      <p>Please log out and log back in to refresh your workspace permissions.</p>
      <div style="text-align: center; margin: 30px 0 10px;">
        <a href="${appUrl}/login" class="button" target="_blank">Sign In Again</a>
      </div>
    </div>
  `;
  return {
    subject: "Your Account Role Has Been Updated",
    html: baseLayout(content),
  };
}
