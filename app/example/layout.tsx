import React from "react";

export default function ExampleLayout({ children }: { children: React.ReactNode }) {
  return <div className="example-boundary">{children}</div>;
}
