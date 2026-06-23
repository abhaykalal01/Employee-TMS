"use client";

export default function Error({
  error,
  reset,
}) {

  return (
    <div>

      <h1 className="text-red-500 text-2xl">
        Something Went Wrong
      </h1>

      <button
        onClick={() => reset()}
        className="bg-red-500 text-white px-4 py-2 mt-4 rounded"
      >
        Retry
      </button>

    </div>
  );
}