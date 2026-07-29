import React from "react";

export default function ServerBoundaryLayout({ children }: { children: React.ReactNode }) {
  return <div className="server-boundary-layout">{children}</div>;
}
