"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton({ text = "Create Task", loadingText = "Creating..." }) {

    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="bg-blue-600 text-white px-4 py-2 rounded mt-4 disabled:opacity-50 cursor-pointer"
        >
            {pending ? loadingText : text}
        </button>
    );
}