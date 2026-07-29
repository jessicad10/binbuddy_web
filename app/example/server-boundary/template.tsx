import React from "react";

export default function ServerBoundaryTemplate({ children }: { children: React.ReactNode }) {
  return <div className="server-boundary-template">{children}</div>;
}
