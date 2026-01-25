import React from "react";

export default function Button({ children, ...props }) {
  return (
    <button
      {...props}
      className="w-full py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
    >
      {children}
    </button>
  );
}
