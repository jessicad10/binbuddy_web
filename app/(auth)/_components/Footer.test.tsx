import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "./Footer";
import { describe, it, expect } from "vitest";

describe("Footer Component Unit Tests", () => {
  it("renders the BinBuddy brand name and mission text", () => {
    render(<Footer />);
    expect(screen.getByText("BinBuddy")).toBeInTheDocument();
    expect(screen.getByText(/"Smart waste sorting for a cleaner tomorrow."/)).toBeInTheDocument();
  });

  it("contains critical quick navigation links", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "Dashboard" })).toHaveAttribute("href", "/dashboard");
    expect(screen.getByRole("link", { name: "Smart Sort" })).toHaveAttribute("href", "/dashboard/smart-sort");
  });

  it("displays the correct copyright notice", () => {
    render(<Footer />);
    expect(screen.getByText(/© 2026 BinBuddy. All rights reserved./)).toBeInTheDocument();
  });
});
