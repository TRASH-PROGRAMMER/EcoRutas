import React from "react";

export const Alert = ({ message, type }: { message: string; type: "success" | "error" }) => (
  <div
    className={`mt-4 p-3 rounded-lg text-white ${
      type === "success" ? "bg-green-600" : "bg-red-500"
    }`}
  >
    {message}
  </div>
);
