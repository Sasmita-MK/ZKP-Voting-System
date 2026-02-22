import React from "react";

export default function Header({ title }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <div className="w-full h-px bg-gray-300 mt-2"></div>
    </div>
  );
}
