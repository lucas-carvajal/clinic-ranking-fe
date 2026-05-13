import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AdminLoginForm } from "./admin-login-form";

const pushMock = vi.fn();
const refreshMock = vi.fn();

let searchParamsString = "";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock,
  }),
  useSearchParams: () => new URLSearchParams(searchParamsString),
}));

describe("AdminLoginForm", () => {
  const user = userEvent.setup();
  const originalFetch = global.fetch;

  beforeEach(() => {
    pushMock.mockReset();
    refreshMock.mockReset();
    searchParamsString = "";
    global.fetch = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.clearAllMocks();
  });

  it("posts credentials to the API proxy and navigates to default admin landing on success", async () => {
    vi.mocked(global.fetch).mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );

    render(<AdminLoginForm />);

    await user.type(screen.getByLabelText(/Benutzername/i), "admin");
    await user.type(screen.getByLabelText(/Passwort/i), "secret");
    await user.click(screen.getByRole("button", { name: /Anmelden/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/proxy/auth/login",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            accept: "application/json",
          }),
          credentials: "same-origin",
          body: JSON.stringify({ username: "admin", password: "secret" }),
        }),
      );
    });

    expect(pushMock).toHaveBeenCalledWith("/admin/review-requests");
    expect(refreshMock).toHaveBeenCalled();
  });

  it("uses sanitized redirect when query is a safe admin path", async () => {
    searchParamsString = "redirect=%2Fadmin%2Ffeedback";

    vi.mocked(global.fetch).mockResolvedValue(new Response(null, { status: 200 }));

    render(<AdminLoginForm />);

    await user.type(screen.getByLabelText(/Benutzername/i), "u");
    await user.type(screen.getByLabelText(/Passwort/i), "p");
    await user.click(screen.getByRole("button", { name: /Anmelden/i }));

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/admin/feedback"));
  });

  it("rejects unsafe redirect targets and falls back to default admin landing", async () => {
    searchParamsString = "redirect=https%3A%2F%2Fevil.example%2Fadmin";

    vi.mocked(global.fetch).mockResolvedValue(new Response(null, { status: 200 }));

    render(<AdminLoginForm />);

    await user.type(screen.getByLabelText(/Benutzername/i), "u");
    await user.type(screen.getByLabelText(/Passwort/i), "p");
    await user.click(screen.getByRole("button", { name: /Anmelden/i }));

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/admin/review-requests"));
  });

  it("shows server error message on failed login", async () => {
    vi.mocked(global.fetch).mockResolvedValue(
      new Response(JSON.stringify({ message: "Ungültige Zugangsdaten" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }),
    );

    render(<AdminLoginForm />);

    await user.type(screen.getByLabelText(/Benutzername/i), "bad");
    await user.type(screen.getByLabelText(/Passwort/i), "creds");
    await user.click(screen.getByRole("button", { name: /Anmelden/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Ungültige Zugangsdaten");
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("shows network error when fetch throws", async () => {
    vi.mocked(global.fetch).mockRejectedValue(new TypeError("Failed to fetch"));

    render(<AdminLoginForm />);

    await user.type(screen.getByLabelText(/Benutzername/i), "u");
    await user.type(screen.getByLabelText(/Passwort/i), "p");
    await user.click(screen.getByRole("button", { name: /Anmelden/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/Verbindungsproblem/i);
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("shows validation hint when username or password is empty (bypasses native required for unit test)", async () => {
    const { container } = render(<AdminLoginForm />);
    const form = container.querySelector("form");
    expect(form).toBeTruthy();
    fireEvent.submit(form!);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /Bitte Benutzername und Passwort eingeben/i,
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
