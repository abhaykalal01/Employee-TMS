"use server";

import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createEmployee(formData) {

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

    revalidatePath("/dashboard/employees");
    redirect("/dashboard/employees");
}
export async function deleteEmployee(formData) {

    await connectDB();

    const id =
        formData.get("id");

    await User.findByIdAndDelete(
        id
    );

    revalidatePath(
        "/dashboard/employees"
    );

}