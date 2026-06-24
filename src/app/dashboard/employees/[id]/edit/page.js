import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { getEmployeeById } from "@/services/userService";
import EditEmployeeForm from "./EditEmployeeForm";

export default async function EditEmployeePage({ params }) {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
        redirect("/dashboard");
    }

    const { id } = await params;
    const employee = await getEmployeeById(id);

    if (!employee) {
        notFound();
    }

    return <EditEmployeeForm employee={employee} />;
}
