# 📧 Email Testing Guide - Employee TMS

Your email system is **production-ready**! This guide will help you test it.

---

## 🚀 Quick Start

### Step 1: Configure SMTP Credentials

Update your `.env.local` file with real SMTP credentials:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM_NAME="Employee TMS"
SMTP_FROM_EMAIL=your-email@gmail.com
```

### Step 2: Generate Gmail App Password

1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Navigate to **Security** → **2-Step Verification** (enable if not already)
3. Scroll down to **App passwords**
4. Generate a new app password for "Mail"
5. Copy the 16-character password
6. Paste it into `SMTP_PASS` in `.env.local`

---

## 🧪 Testing Methods

### Method 1: Web UI (Recommended)

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Login as **admin**

3. Navigate to **Email Test** page:
   - In the sidebar, click **"Email Test"**
   - Or go to: `http://localhost:3000/dashboard/settings/email-test`

4. Click **"Test All Emails"** or test individual email types

5. Check your inbox for test emails!

### Method 2: API Testing

You can also test via the API endpoint:

```bash
# Test connection
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"type": "connection", "email": "test@example.com"}'

# Test welcome email
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"type": "welcome", "email": "test@example.com"}'
```

**Note:** You must be logged in as admin for API tests to work.

### Method 3: Command Line (Node.js)

Run the email test utility directly:

```bash
# Test all emails (sends to SMTP_USER from .env.local)
node src/lib/emailTest.js

# Test all emails to specific address
node src/lib/emailTest.js your-email@example.com
```

---

## 📋 Email Types Available

| Email Type | Trigger | Template Function |
|------------|---------|-------------------|
| **Welcome Email** | New employee created | `welcomeEmailTemplate()` |
| **Task Assigned** | Admin assigns task | `taskAssignedEmailTemplate()` |
| **Task Status Changed** | Task status updated | `taskStatusChangedEmailTemplate()` |
| **Password Reset** | User requests reset | `passwordResetEmailTemplate()` |
| **Role Changed** | Admin changes role | `roleChangedEmailTemplate()` |

---

## ✅ Live Testing Scenarios

### Test 1: Welcome Email
1. Login as **admin**
2. Go to **Employees** → **Create Employee**
3. Fill in the form and submit
4. Check the new employee's email inbox
5. ✅ Should receive welcome email with login credentials

### Test 2: Task Assignment Email
1. Login as **admin**
2. Go to **Create Task**
3. Assign task to an employee
4. Submit the form
5. Check employee's email inbox
6. ✅ Should receive task assignment notification

### Test 3: Task Status Change Email
1. Login as **employee**
2. Go to **My Tasks**
3. Change status of a task (Pending → In Progress)
4. Check admin's email inbox
5. ✅ Admin should receive status update notification

**OR**

1. Login as **admin**
2. Edit a task assigned to an employee
3. Change the status
4. Check employee's email inbox
5. ✅ Employee should receive status update notification

### Test 4: Password Reset Email
1. Logout
2. Go to **Forgot Password** page (`/forgot-password`)
3. Enter an existing user's email
4. Submit the form
5. Check that email inbox
6. ✅ Should receive password reset email with link

### Test 5: Role Change Email
1. Login as **admin**
2. Go to **Employees** → Select an employee
3. Click **Edit**
4. Change their role (employee → admin or vice versa)
5. Submit the form
6. Check employee's email inbox
7. ✅ Should receive role change notification

---

## 🔍 Troubleshooting

### Issue: "Failed to send email"

**Check server logs** for detailed error messages:
```
[Mail 2026-07-07T...] ✗ Failed to send "Welcome Email" to user@example.com: Invalid credentials
```

**Common solutions:**
- ✅ Verify SMTP credentials in `.env.local`
- ✅ Ensure Gmail app password is correct (not your regular password)
- ✅ Enable 2-Step Verification in Google Account
- ✅ Check if SMTP_PORT is correct (usually 587 or 465)
- ✅ Restart the dev server after changing `.env.local`

### Issue: "Authentication failed"

This means your SMTP credentials are incorrect.

**For Gmail:**
- Use an **App Password**, NOT your regular Gmail password
- Enable 2-Step Verification first
- Generate app password at: https://myaccount.google.com/apppasswords

### Issue: Emails not arriving

1. **Check spam folder** - emails might be filtered
2. **Check server logs** - confirm email was sent successfully
3. **Test with different email provider** - some providers have strict filtering
4. **Verify FROM address** - ensure SMTP_FROM_EMAIL matches SMTP_USER for Gmail

### Issue: "Transporter unavailable"

This means SMTP credentials are missing from `.env.local`.

**Solution:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-actual-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM_EMAIL=your-actual-email@gmail.com
```

Restart the server after updating.

---

## 🎨 Email Templates

All email templates are located in:
```
src/lib/emailTemplates.js
```

Each template includes:
- ✅ **Responsive HTML** - works on desktop & mobile
- ✅ **Dark theme design** - matches dashboard aesthetic
- ✅ **Gradient buttons** - purple-to-blue branding
- ✅ **Professional layout** - with header, content, and footer
- ✅ **Dynamic content** - personalized with user data

### Example: Customizing Welcome Email

Edit `src/lib/emailTemplates.js`:

```javascript
export function welcomeEmailTemplate({ name, email, tempPassword }) {
  const content = `
    <h2 class="title">Welcome to the Team, ${name}!</h2>
    <div class="content">
      <p>Your custom welcome message here...</p>
      <!-- Rest of the template -->
    </div>
  `;
  return {
    subject: "Your Custom Subject Line",
    html: baseLayout(content),
  };
}
```

---

## 📊 Email Service Architecture

### Fire-and-Forget Design

Your email system uses `queueEmail()` for non-blocking email delivery:

```javascript
// Doesn't block the request
queueEmail({
    to: employee.email,
    ...welcomeEmailTemplate({ name, email, tempPassword }),
});
```

### Connection Pooling

The SMTP transporter uses connection pooling for efficiency:
- Max 3 concurrent connections
- Max 50 messages per connection
- Automatic reconnection on failure

### Graceful Degradation

If SMTP is misconfigured, the app continues to work:
- Logs warnings instead of crashing
- Business logic proceeds normally
- Users don't see errors related to email

---

## 🔒 Security Features

- ✅ **No hardcoded secrets** - all in `.env.local`
- ✅ **Password reset tokens** - SHA-256 hashed in database
- ✅ **1-hour token expiry** - automatic cleanup
- ✅ **No email enumeration** - same response regardless if user exists
- ✅ **Temp passwords** - only sent once via email (never stored)
- ✅ **SMTP credentials** - stored in environment variables
- ✅ **HTTP-only cookies** - for session management

---

## 📈 Production Deployment

### Environment Variables Required

Make sure these are set in your production environment:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-production-email@gmail.com
SMTP_PASS=your-production-app-password
SMTP_FROM_NAME="Employee TMS"
SMTP_FROM_EMAIL=your-production-email@gmail.com
```

### Using Other SMTP Providers

#### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

#### Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASS=your-mailgun-password
```

#### AWS SES
```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-ses-smtp-username
SMTP_PASS=your-ses-smtp-password
```

---

## 🎯 Next Steps

1. ✅ **Update `.env.local`** with real SMTP credentials
2. ✅ **Test using Web UI** - Go to Email Test page
3. ✅ **Test live scenarios** - Create employee, assign task, etc.
4. ✅ **Verify emails arrive** - Check inbox (and spam folder)
5. ✅ **Customize templates** - Edit `emailTemplates.js` if needed
6. ✅ **Deploy to production** - Set environment variables

---

## 📚 File References

| File | Purpose |
|------|---------|
| `src/lib/mail.js` | Core email service with SMTP configuration |
| `src/lib/emailTemplates.js` | All HTML email templates |
| `src/lib/emailTest.js` | Command-line testing utility |
| `src/app/api/test-email/route.js` | API endpoint for web UI testing |
| `src/app/dashboard/settings/email-test/page.js` | Web UI test page |
| `src/actions/employeeActions.js` | Sends welcome & role change emails |
| `src/actions/taskActions.js` | Sends task-related emails |
| `src/actions/passwordResetActions.js` | Sends password reset emails |

---

## ✨ Your Email System Features

✅ **5 Email Types** - Welcome, Task Assigned, Status Changed, Password Reset, Role Changed  
✅ **Beautiful Templates** - Dark theme, responsive, gradient buttons  
✅ **Production-Ready** - Connection pooling, error handling, logging  
✅ **Testing Tools** - Web UI, API, and CLI testing  
✅ **Secure** - Hashed tokens, no hardcoded secrets, graceful failures  
✅ **Non-Blocking** - Fire-and-forget email queue  
✅ **Flexible** - Works with Gmail, SendGrid, Mailgun, AWS SES  

---

**Your email system is ready to go! Just add your SMTP credentials and test it out.** 🚀

For questions or issues, check the server logs for detailed error messages.
