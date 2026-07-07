"use server";

import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import PasswordResetToken from "@/models/PasswordResetToken";
import { connectDB } from "@/lib/db";
import { sendEmail } from "@/lib/mail";
import { passwordResetEmailTemplate } from "@/lib/emailTemplates";

// Hash token for secure DB storage
function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function requestPasswordReset(prevState, formData) {
  try {
    await connectDB();

    const email = (formData.get("email") || "").toString().trim().toLowerCase();

    if (!email) {
      return { error: "Email is required." };
    }

    const user = await User.findOne({ email });

    // Security best practice: do not leak whether an email exists or not.
    // Return success message even if email is not registered.
    if (!user) {
      return { success: true, message: "If that email address exists in our system, we have sent reset instructions." };
    }

    // Generate secure random token
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = hashToken(rawToken);

    // Set expiry to 1 hour from now
    const expiresAt = new Date(Date.now() + 3600000);

    // Remove any existing tokens for this user first
    await PasswordResetToken.deleteMany({ userId: user._id });

    // Store token in DB
    await PasswordResetToken.create({
      userId: user._id,
      token: hashedToken,
      expiresAt,
    });

    // Send reset email (can be awaited to handle potential send failures gracefully or fired-and-forgotten)
    const emailResult = await sendEmail({
      to: user.email,
      ...passwordResetEmailTemplate({
        name: user.name,
        resetToken: rawToken,
      }),
    });

    if (!emailResult) {
      console.error(`[PasswordReset] Failed to send password reset email to ${email}`);
    }

    return { success: true, message: "If that email address exists in our system, we have sent reset instructions." };
  } catch (error) {
    console.error("Request password reset error:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

export async function resetPassword(prevState, formData) {
  try {
    await connectDB();

    const token = (formData.get("token") || "").toString().trim();
    const password = (formData.get("password") || "").toString();
    const confirmPassword = (formData.get("confirmPassword") || "").toString();

    if (!token) {
      return { error: "Invalid reset token." };
    }

    if (!password || password.length < 8) {
      return { error: "Password must be at least 8 characters long." };
    }

    if (password !== confirmPassword) {
      return { error: "Passwords do not match." };
    }

    // Lookup hashed token
    const hashedToken = hashToken(token);
    const resetTokenDoc = await PasswordResetToken.findOne({
      token: hashedToken,
      expiresAt: { $gt: new Date() },
    });

    if (!resetTokenDoc) {
      return { error: "This link is invalid or has expired. Please request a new password reset." };
    }

    const user = await User.findById(resetTokenDoc.userId);
    if (!user) {
      return { error: "User account not found." };
    }

    // Update password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    // Clean up used token
    await PasswordResetToken.deleteMany({ userId: user._id });

    return { success: true, message: "Your password has been successfully reset. You can now log in." };
  } catch (error) {
    console.error("Reset password error:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}
