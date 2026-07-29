import React from "react";

export default function DeleteModal() {
  return (
    <div className="bg-red-50 rounded-2xl p-4 border border-red-150 text-xs">
      <h3 className="font-bold text-red-800">Delete Blog Warning</h3>
      <p className="text-red-700 mt-1">This modal manages deletion confirmations for administrative posts.</p>
    </div>
  );
}
