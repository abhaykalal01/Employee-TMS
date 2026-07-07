import nodemailer from "nodemailer";

// ---------------------------------------------------------------------------
// Singleton SMTP transporter
// ---------------------------------------------------------------------------

let transporter = null;

function getTransporter() {
    if (transporter) {
        return transporter;
    }

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT) || 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
        console.warn(
            "[Mail] SMTP credentials missing (SMTP_HOST, SMTP_USER, SMTP_PASS). Emails will be skipped."
        );
        return null;
    }

    transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
        pool: true,
        maxConnections: 3,
        maxMessages: 50,
    });

    return transporter;
}

// ---------------------------------------------------------------------------
// Core sendEmail — fire-and-forget safe
// ---------------------------------------------------------------------------

/**
 * Send an email via SMTP.
 *
 * @param {object} options
 * @param {string} options.to       - Recipient email address
 * @param {string} options.subject  - Email subject line
 * @param {string} options.html     - HTML body content
 * @returns {Promise<boolean>}      - true if sent, false if skipped/failed
 */
export async function sendEmail({ to, subject, html }) {
    const tag = `[Mail ${new Date().toISOString()}]`;

    if (!to) {
        console.warn(`${tag} No recipient provided. Skipping.`);
        return false;
    }

    const transport = getTransporter();

    if (!transport) {
        console.warn(`${tag} Transporter unavailable. Skipping email to ${to}.`);
        return false;
    }

    const fromName = process.env.SMTP_FROM_NAME || "Employee TMS";
    const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;

    try {
        const info = await transport.sendMail({
            from: `"${fromName}" <${fromEmail}>`,
            to,
            subject,
            html,
        });

        console.log(`${tag} ✓ Sent "${subject}" to ${to} (messageId: ${info.messageId})`);
        return true;
    } catch (error) {
        console.error(`${tag} ✗ Failed to send "${subject}" to ${to}:`, error.message);
        return false;
    }
}

// ---------------------------------------------------------------------------
// Fire-and-forget helper — use when you don't want to await the result
// ---------------------------------------------------------------------------

/**
 * Queue an email without blocking the caller.
 * Logs errors but never throws.
 */
export function queueEmail(options) {
    sendEmail(options).catch(() => {
        // Already logged inside sendEmail
    });
}
