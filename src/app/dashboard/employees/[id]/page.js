import { redirect } from "next/navigation";

export default async function EmployeeDetailsPage({ params }) {
    const { id } = await params;
    redirect(`/dashboard/employees/${id}/edit`);
}
