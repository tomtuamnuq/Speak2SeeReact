import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "./LoginPage";
import AuthService from "../services/AuthService";
import { ThemeProvider } from "../contexts/ThemeContext";
import "@testing-library/jest-dom";

jest.mock("../services/AuthService");

describe("LoginPage", () => {
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });
  const mockAuthService = new AuthService("", "") as jest.Mocked<AuthService>;
  const mockOnLoginSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders login form", () => {
    render(
      <ThemeProvider>
        <LoginPage
          authService={mockAuthService}
          onLoginSuccess={mockOnLoginSuccess}
        />
      </ThemeProvider>
    );

    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it("handles successful login", async () => {
    mockAuthService.login.mockResolvedValueOnce(true);

    render(
      <ThemeProvider>
        <LoginPage
          authService={mockAuthService}
          onLoginSuccess={mockOnLoginSuccess}
        />
      </ThemeProvider>
    );

    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockOnLoginSuccess).toHaveBeenCalled();
    });
  });

  it("shows error message on failed login", async () => {
    mockAuthService.login.mockResolvedValueOnce(false);

    render(
      <ThemeProvider>
        <LoginPage
          authService={mockAuthService}
          onLoginSuccess={mockOnLoginSuccess}
        />
      </ThemeProvider>
    );

    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });
});
