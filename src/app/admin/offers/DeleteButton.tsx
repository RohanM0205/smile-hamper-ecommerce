"use client";

export default function DeleteButton() {
  return (
    <button
      type="submit"
      className="text-red-600"
      onClick={(e) => {
        if (!confirm("Are you sure?")) {
          e.preventDefault();
        }
      }}
    >
      Delete
    </button>
  );
}