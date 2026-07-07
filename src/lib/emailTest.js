/**
 * Email Testing Utility
 * 
 * This module helps you test your email configuration and templates.
 * Run this file directly or import functions to test individual emails.
 * 
 * Usage:
 *   node --experimental-modules src/lib/emailTest.js
 * 
 * Or import in your code:
 *   import { testEmailConnection, sendTestEmail } from '@/lib/emailTest';
 */

import { sendEmail } from "./mail.js";
import {
    welcomeEmailTemplate,
    taskAssignedEmailTemplate,
    taskStatusChangedEmailTemplate,
    passwordResetEmailTemplate,
    roleChangedEmailTemplate,
} from "./emailTemplates.js";

/**
 * Test SMTP connection
 * @returns {Promise<boolean>}
 */
export async function testEmailConnection() {
    console.log("\n🔍 Testing SMTP Connection...\n");

    const testEmail = process.env.SMTP_USER || "test@example.com";

    try {
        const result = await sendEmail({
            to: testEmail,
            subject: "Employee TMS - Connection Test",
            html: `
                <div style="font-family: sans-serif; padding: 20px; background: #020617; color: #f8fafc;">
                    <h2 style="color: #7c3aed;">✅ SMTP Connection Successful!</h2>
                    <p>Your Employee TMS email system is configured correctly.</p>
                    <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
                </div>
            `,
        });

        if (result) {
            console.log("✅ SMTP connection test passed!");
            console.log(`📧 Test email sent to: ${testEmail}`);
            return true;
        } else {
            console.log("❌ SMTP connection test failed!");
            console.log("Check your .env.local SMTP configuration.");
            return false;
        }
    } catch (error) {
        console.error("❌ SMTP connection error:", error.message);
        return false;
    }
}

/**
 * Send a welcome email test
 */
export async function testWelcomeEmail(recipientEmail) {
    console.log("\n📧 Testing Welcome Email...\n");

    const result = await sendEmail({
        to: recipientEmail || process.env.SMTP_USER,
        ...welcomeEmailTemplate({
            name: "John Doe",
            email: recipientEmail || "john.doe@example.com",
            tempPassword: "TestPass123!",
        }),
    });

    if (result) {
        console.log("✅ Welcome email sent successfully!");
    } else {
        console.log("❌ Welcome email failed to send.");
    }

    return result;
}

/**
 * Send a task assigned email test
 */
export async function testTaskAssignedEmail(recipientEmail) {
    console.log("\n📧 Testing Task Assigned Email...\n");

    const result = await sendEmail({
        to: recipientEmail || process.env.SMTP_USER,
        ...taskAssignedEmailTemplate({
            employeeName: "John Doe",
            taskTitle: "Complete Q4 Financial Report",
            creatorName: "Admin Manager",
        }),
    });

    if (result) {
        console.log("✅ Task assigned email sent successfully!");
    } else {
        console.log("❌ Task assigned email failed to send.");
    }

    return result;
}

/**
 * Send a task status changed email test
 */
export async function testTaskStatusChangedEmail(recipientEmail) {
    console.log("\n📧 Testing Task Status Changed Email...\n");

    const result = await sendEmail({
        to: recipientEmail || process.env.SMTP_USER,
        ...taskStatusChangedEmailTemplate({
            recipientName: "John Doe",
            taskTitle: "Complete Q4 Financial Report",
            oldStatus: "Pending",
            newStatus: "In Progress",
            actorName: "Jane Smith",
        }),
    });

    if (result) {
        console.log("✅ Task status changed email sent successfully!");
    } else {
        console.log("❌ Task status changed email failed to send.");
    }

    return result;
}

/**
 * Send a password reset email test
 */
export async function testPasswordResetEmail(recipientEmail) {
    console.log("\n📧 Testing Password Reset Email...\n");

    const result = await sendEmail({
        to: recipientEmail || process.env.SMTP_USER,
        ...passwordResetEmailTemplate({
            name: "John Doe",
            resetToken: "test-token-abc123xyz456",
        }),
    });

    if (result) {
        console.log("✅ Password reset email sent successfully!");
    } else {
        console.log("❌ Password reset email failed to send.");
    }

    return result;
}

/**
 * Send a role changed email test
 */
export async function testRoleChangedEmail(recipientEmail) {
    console.log("\n📧 Testing Role Changed Email...\n");

    const result = await sendEmail({
        to: recipientEmail || process.env.SMTP_USER,
        ...roleChangedEmailTemplate({
            name: "John Doe",
            oldRole: "employee",
            newRole: "admin",
            actorName: "System Administrator",
        }),
    });

    if (result) {
        console.log("✅ Role changed email sent successfully!");
    } else {
        console.log("❌ Role changed email failed to send.");
    }

    return result;
}

/**
 * Run all email tests
 */
export async function runAllEmailTests(recipientEmail) {
    console.log("\n" + "=".repeat(60));
    console.log("🚀 Employee TMS - Email System Test Suite");
    console.log("=".repeat(60));

    const testRecipient = recipientEmail || process.env.SMTP_USER;

    if (!testRecipient) {
        console.error("\n❌ Error: No recipient email specified.");
        console.log("   Set SMTP_USER in .env.local or pass email as argument.");
        return;
    }

    console.log(`\n📬 Sending all test emails to: ${testRecipient}\n`);

    const results = {
        connection: await testEmailConnection(),
        welcome: await testWelcomeEmail(testRecipient),
        taskAssigned: await testTaskAssignedEmail(testRecipient),
        taskStatusChanged: await testTaskStatusChangedEmail(testRecipient),
        passwordReset: await testPasswordResetEmail(testRecipient),
        roleChanged: await testRoleChangedEmail(testRecipient),
    };

    console.log("\n" + "=".repeat(60));
    console.log("📊 Test Results Summary");
    console.log("=".repeat(60) + "\n");

    const passed = Object.values(results).filter(Boolean).length;
    const total = Object.keys(results).length;

    Object.entries(results).forEach(([test, result]) => {
        const status = result ? "✅ PASS" : "❌ FAIL";
        const testName = test.replace(/([A-Z])/g, " $1").trim();
        console.log(`${status} - ${testName}`);
    });

    console.log("\n" + "-".repeat(60));
    console.log(`Total: ${passed}/${total} tests passed`);
    console.log("=".repeat(60) + "\n");

    if (passed === total) {
        console.log("🎉 All tests passed! Your email system is working perfectly.\n");
    } else {
        console.log("⚠️  Some tests failed. Check your SMTP configuration in .env.local\n");
        console.log("Required environment variables:");
        console.log("  - SMTP_HOST");
        console.log("  - SMTP_PORT");
        console.log("  - SMTP_USER");
        console.log("  - SMTP_PASS");
        console.log("  - SMTP_FROM_EMAIL");
        console.log("  - SMTP_FROM_NAME (optional)\n");
    }

    return results;
}

// If this file is run directly, execute all tests
if (import.meta.url === `file://${process.argv[1]}`) {
    const recipientEmail = process.argv[2];
    runAllEmailTests(recipientEmail).catch(console.error);
}
