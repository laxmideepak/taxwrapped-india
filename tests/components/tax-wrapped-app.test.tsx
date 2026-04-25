import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { TaxWrappedApp } from "@/components/TaxWrappedApp";

describe("TaxWrappedApp", () => {
  it("starts with the new-regime-only privacy posture", async () => {
    render(<TaxWrappedApp initialLocale="en" />);

    expect(
      screen.getByRole("heading", {
        name: /tax wrapped/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/new regime only for now/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(
        screen.getByText(/nothing is stored on our servers/i),
      ).toBeInTheDocument();
    });
  });

  it("calculates a wrap and renders all mandatory cards", async () => {
    const user = userEvent.setup();
    render(<TaxWrappedApp initialLocale="en" />);

    await user.click(screen.getByRole("button", { name: /^start$/i }));
    const salaryInput = await screen.findByLabelText(/gross salary/i);
    fireEvent.change(salaryInput, { target: { value: "1800000" } });
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /^next$/i })).not.toBeDisabled();
    });
    await user.click(screen.getByRole("button", { name: /^next$/i }));

    expect(screen.getAllByText("₹2,15,800").length).toBeGreaterThan(0);
    expect(screen.getByText(/grants to states/i)).toBeInTheDocument();
    expect(screen.getByText(/Defence/i)).toBeInTheDocument();
    expect(screen.getAllByText(/interest payments/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/share a rounded/i)).toBeInTheDocument();
  });

  it("switches visible interface copy to Hindi", async () => {
    const user = userEvent.setup();
    render(<TaxWrappedApp initialLocale="en" />);

    await user.click(screen.getByRole("button", { name: /हिंदी/i }));
    await waitFor(() => {
      expect(screen.getByText("भारत")).toBeInTheDocument();
    });
  });
});
