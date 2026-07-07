import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { sendEmail } from "@/lib/mail";
import {
    welcomeEmailTemplate,
    taskAssignedEmailTemplate,
    taskStatusChangedEmailTemplate,
    passwordResetEmailTemplate,
    roleChangedEmailTemplate,
} from "@/lib/emailTemplates";

/**
 * Email Testing API Endpoint
 * 
 * This endpoint allows admins to test email functionality from the dashboard.
 * 
 * POST /api/test-email
 * Body: { type: "welcome" | "taskAssigned" | "taskStatusChanged" | "passwordReset" | "roleChanged", email?: string }
 */
export async function POST(request) {
    try {
        const user = await getCurrentUser();

        // Only admins can test emails
        if (!user || user.role !== "admin") {
            return NextResponse.json(
                { error: "Unauthorized. Admin access required." },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { type, email } = body;

        // Use provided email or fall back to current user's email
        const recipientEmail = email || user.email;

        if (!recipientEmail) {
            return NextResponse.json(
                { error: "No recipient email provided." },
                { status: 400 }
            );
        }

        let emailResult;

        switch (type) {
            case "welcome":
                emailResult = await sendEmail({
                    to: recipientEmail,
                    ...welcomeEmailTemplate({
                        name: "Test User",
                        email: recipientEmail,
                        tempPassword: "TestPassword123!",
                    }),
                });
                break;

            case "taskAssigned":
                emailResult = await sendEmail({
                    to: recipientEmail,
                    ...taskAssignedEmailTemplate({
                        employeeName: user.name,
                        taskTitle: "Test Task - Complete Documentation",
                        creatorName: "Admin Manager",
                    }),
                });
                break;

            case "taskStatusChanged":
                emailResult = await sendEmail({
                    to: recipientEmail,
                    ...taskStatusChangedEmailTemplate({
                        recipientName: user.name,
                        taskTitle: "Test Task - Complete Documentation",
                        oldStatus: "Pending",
                        newStatus: "In Progress",
                        actorName: user.name,
                    }),
                });
                break;

            case "passwordReset":
                emailResult = await sendEmail({
                    to: recipientEmail,
                    ...passwordResetEmailTemplate({
                        name: user.name,
                        resetToken: "test-token-demo-only",
                    }),
                });
                break;

            case "roleChanged":
                emailResult = await sendEmail({
                    to: recipientEmail,
                    ...roleChangedEmailTemplate({
                        name: user.name,
                        oldRole: "employee",
                        newRole: "admin",
                        actorName: "System Administrator",
                    }),
                });
                break;

            case "connection":
                emailResult = await sendEmail({
                    to: recipientEmail,
                    subject: "Employee TMS - Connection Test",
                    html: `
                        <div style="font-family: sans-serif; padding: 20px; background: #020617; color: #f8fafc; border-radius: 12px;">
                            <h2 style="color: #7c3aed;">✅ SMTP Connection Successful!</h2>
                            <p>Your Employee TMS email system is configured correctly.</p>
                            <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
                            <p><strong>Tested by:</strong> ${user.name} (${user.email})</p>
                        </div>
                    `,
                });
                break;

            default:
                return NextResponse.json(
                    { error: "Invalid email type specified." },
                    { status: 400 }
                );
        }

        if (emailResult) {
            return NextResponse.json({
                success: true,
                message: `Test email sent successfully to ${recipientEmail}`,
                type,
            });
        } else {
            return NextResponse.json(
                {
                    success: false,
                    message: "Failed to send test email. Check server logs for details.",
                },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Test email API error:", error);
        return NextResponse.json(
            { error: "An unexpected error occurred while sending test email." },
            { status: 500 }
        );
    }
}
