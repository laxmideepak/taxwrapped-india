import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { TaxWrappedApp } from "@/components/TaxWrappedApp";

describe("TaxWrappedApp", () => {
  it("starts with the new-regime-only privacy posture", () => {
    render(<TaxWrappedApp initialLocale="en" />);

    expect(
      screen.getByRole("heading", {
        name: /where did your tax go in fy 2025-26/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/new regime only for now/i)).toBeInTheDocument();
    expect(
      screen.getByText(/calculations happen in your browser/i),
    ).toBeInTheDocument();
  });

  it("calculates a wrap and renders all mandatory cards", async () => {
    const user = userEvent.setup();
    render(<TaxWrappedApp initialLocale="en" />);

    await user.click(screen.getByRole("button", { name: /start/i }));
    const salaryInput = await screen.findByLabelText(/annual gross salary/i);
    await user.type(
      salaryInput,
      "1800000",
    );
    await user.click(screen.getByRole("button", { name: /reveal/i }));

    expect(screen.getAllByText("₹1,50,800").length).toBeGreaterThan(0);
    expect(screen.getByText(/centre vs states/i)).toBeInTheDocument();
    expect(screen.getAllByText(/interest payments/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/share a rounded/i)).toBeInTheDocument();
  });

  it("switches visible interface copy to Hindi", async () => {
    const user = userEvent.setup();
    render(<TaxWrappedApp initialLocale="en" />);

    await user.click(screen.getByRole("button", { name: /हिंदी/i }));

    expect(screen.getByText(/आपका टैक्स कहां गया/i)).toBeInTheDocument();
  });
});
