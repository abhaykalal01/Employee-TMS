"use server";

import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { queueEmail } from "@/lib/mail";
import { welcomeEmailTemplate, roleChangedEmailTemplate } from "@/lib/emailTemplates";

export async function createEmployee(formData) {
    await requireAdmin();
    await connectDB();

    const name = (formData.get("name") || "").toString().trim();
    const email = (formData.get("email") || "").toString().trim().toLowerCase();
    const password = (formData.get("password") || "").toString();
    const role = (formData.get("role") || "employee").toString();

    if (!name || !email || !password) {
        throw new Error("Name, email, and password are required.");
    }

    if (password.length < 8) {
        throw new Error("Password must be at least 8 characters.");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error("An account with this email already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
        name,
        email,
        password: hashedPassword,
        role,
    });

    queueEmail({
        to: email,
        ...welcomeEmailTemplate({
            name,
            email,
            tempPassword: password,
        }),
    });

    revalidatePath("/dashboard/employees");
    redirect("/dashboard/employees");
}

export async function updateEmployee(formData) {
    try {
        await requireAdmin();
        await connectDB();

        const id = (formData.get("id") || "").toString().trim();
        const name = (formData.get("name") || "").toString().trim();
        const email = (formData.get("email") || "").toString().trim().toLowerCase();
        const role = (formData.get("role") || "employee").toString().trim().toLowerCase();

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid employee id.");
        }

        if (!name || !email) {
            throw new Error("Name and email are required.");
        }

        if (!["admin", "employee"].includes(role)) {
            throw new Error("Invalid role selected.");
        }

        const objectId = new mongoose.Types.ObjectId(id);

        const existingUser = await User.findOne({
            email,
            _id: { $ne: objectId },
        });

        if (existingUser) {
            throw new Error("An account with this email already exists.");
        }

        const previousUser = await User.findById(objectId);
        if (!previousUser) {
            throw new Error("Employee not found.");
        }

        const updatedUser = await User.findByIdAndUpdate(
            objectId,
            { name, email, role },
            { new: true }
        );

        if (!updatedUser) {
            throw new Error("Employee not found.");
        }

        if (previousUser.role !== updatedUser.role) {
            queueEmail({
                to: updatedUser.email,
                ...roleChangedEmailTemplate({
                    name: updatedUser.name,
                    oldRole: previousUser.role,
                    newRole: updatedUser.role,
                    actorName: "Admin",
                }),
            });
        }

        revalidatePath("/dashboard/employees");
        revalidatePath(`/dashboard/employees/${id}/edit`);
        redirect("/dashboard/employees");
    } catch (error) {
        if (error?.digest?.startsWith("NEXT_REDIRECT")) {
            throw error;
        }
        console.error("Update employee error:", error);
        throw error;
    }
}

export async function deleteEmployee(formData) {
    await requireAdmin();
    await connectDB();

    const id = (formData.get("id") || "").toString();

    if (!id) {
        throw new Error("Employee id is required.");
    }

    await User.findByIdAndDelete(id);

    revalidatePath("/dashboard/employees");
}
