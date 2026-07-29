"use client";

import React from "react";

export default function ErrorBoundary({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="bg-red-50 p-4 border border-red-200 rounded-xl text-xs">
      <p className="text-red-800 font-bold">Error encountered inside server boundary!</p>
      <p className="text-red-700 mt-1">{error?.message}</p>
      <button onClick={reset} className="mt-3 px-3 py-1 bg-red-600 text-white rounded font-bold">Retry</button>
    </div>
  );
}
