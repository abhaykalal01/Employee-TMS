import { getTaskById } from "@/services/taskService";
import { notFound } from "next/navigation";

export default async function TaskDetails({
  params,
}) {
  const { id } = await params;

  const task = await getTaskById(id);

  if (!task) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">
        {task.title}
      </h1>
      <p className="mt-3">
        Status : {task.status}
      </p>
    </div>
  );
}