# 📧 Gmail SMTP Setup Guide

Follow these steps to configure Gmail SMTP for your Employee TMS email system.

---

## 🔐 Step-by-Step Setup

### Step 1: Enable 2-Step Verification

1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Click **Security** in the left sidebar
3. Scroll to **"Signing in to Google"**
4. Click **2-Step Verification**
5. Follow the prompts to enable it (if not already enabled)

### Step 2: Generate App Password

1. Still in **Security** settings
2. Scroll to **"Signing in to Google"**
3. Click **App passwords** (you'll only see this if 2-Step Verification is on)
4. You may need to sign in again
5. In the "Select app" dropdown, choose **Mail**
6. In the "Select device" dropdown, choose **Other (Custom name)**
7. Enter: **Employee TMS**
8. Click **Generate**
9. **Copy the 16-character password** (it will look like: `abcd efgh ijkl mnop`)

### Step 3: Update Your `.env.local`

Open `c:\Users\Abhay\Desktop\Nextjs\employee-tms\.env.local` and update:

```env
# Replace these placeholder values:
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-actual-email@gmail.com
SMTP_PASS=abcdefghijklmnop
SMTP_FROM_NAME="Employee TMS"
SMTP_FROM_EMAIL=your-actual-email@gmail.com
```

**Important Notes:**
- Remove spaces from the app password (copy as one string)
- Don't use your regular Gmail password
- Use the same email for both `SMTP_USER` and `SMTP_FROM_EMAIL`

### Step 4: Restart Your Server

```bash
# Stop the current server (Ctrl+C)
# Then start it again:
npm run dev
```

### Step 5: Test Your Configuration

**Option 1: Web UI**
1. Login as admin
2. Navigate to: `http://localhost:3000/dashboard/settings/email-test`
3. Click **"Test All Emails"**
4. Check your inbox!

**Option 2: Create a Test Employee**
1. Go to **Employees** → **Create Employee**
2. Fill in the form with a valid email
3. Submit
4. Check that email inbox for welcome message

---

## ✅ Verification

After setup, you should see logs like this in your terminal:

```
[Mail 2026-07-07T12:34:56.789Z] ✓ Sent "Welcome to Employee TMS" to user@example.com (messageId: <abc123@gmail.com>)
```

If you see errors instead, check the troubleshooting section below.

---

## 🔧 Troubleshooting

### "Invalid credentials" Error

**Cause:** Wrong app password or 2-Step Verification not enabled

**Solution:**
1. Verify 2-Step Verification is ON
2. Generate a NEW app password
3. Copy it WITHOUT spaces
4. Update `.env.local`
5. Restart server

### "Username and Password not accepted"

**Cause:** Using regular Gmail password instead of app password

**Solution:**
- Don't use your regular Gmail password
- Generate an app-specific password (Step 2 above)
- Use that password in `SMTP_PASS`

### "Less secure app access"

**Note:** Google removed "Less secure app access" in May 2022. You MUST use 2-Step Verification + App Passwords now.

### Can't Find "App passwords" Option

**Possible causes:**
1. 2-Step Verification is not enabled → Enable it first
2. Using a Google Workspace account with admin restrictions → Contact your admin
3. Using a very old Google account → Try updating security settings first

### Emails Going to Spam

**Solutions:**
1. Check your Gmail's Sent folder to verify email was sent
2. Add your sender email to recipient's contacts
3. Ask recipients to mark as "Not spam"
4. For production, consider using SendGrid, Mailgun, or AWS SES

---

## 🌐 Alternative: Using a Different Email

If you want to use a different Gmail account for sending:

1. Create a new Gmail account (e.g., `employeetms@gmail.com`)
2. Enable 2-Step Verification on that account
3. Generate app password for that account
4. Update `.env.local` with new credentials
5. This keeps your personal email separate

---

## 📝 Example Configuration

Here's a complete working example:

```env
# MongoDB
MONGODB_URI=mongodb+srv://your-connection-string

# JWT
JWT_SECRET=your-secret-key
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# SMTP Configuration (UPDATED)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=employeetms@gmail.com
SMTP_PASS=abcd1234efgh5678
SMTP_FROM_NAME="Employee TMS"
SMTP_FROM_EMAIL=employeetms@gmail.com
```

---

## 🚀 Testing Checklist

- [ ] 2-Step Verification enabled on Gmail
- [ ] App password generated
- [ ] `.env.local` updated with correct credentials
- [ ] Server restarted
- [ ] Test email sent successfully via Email Test page
- [ ] Welcome email received when creating employee
- [ ] Task notification email received when assigning task
- [ ] Password reset email received when requesting reset

---

## 🎯 Production Considerations

For production deployments:

1. **Use a dedicated email account** - Not your personal Gmail
2. **Consider email service providers**:
   - SendGrid (12,000 free emails/month)
   - Mailgun (5,000 free emails/month)
   - AWS SES ($0.10 per 1,000 emails)
3. **Set up SPF/DKIM records** - Improves deliverability
4. **Monitor email bounce rates** - Track failed deliveries
5. **Set up error notifications** - Alert when emails fail

---

## ❓ Need Help?

If you're still having issues:

1. Check server logs for specific error messages
2. Verify all environment variables are set correctly
3. Try generating a new app password
4. Test with a different email address
5. Check Gmail's "Account activity" for blocked sign-in attempts

---

**Once configured, your email system will work automatically!** ✨

All employee creation, task assignments, status changes, and password resets will trigger emails automatically.
