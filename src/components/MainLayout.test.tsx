import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MainLayout from "./MainLayout";
import ApiService from "../services/ApiService";
import AuthService from "../services/AuthService";
import { ProcessingStatus } from "../../shared/common-utils";
import { ThemeProvider } from "../contexts/ThemeContext";
import "@testing-library/jest-dom";

jest.mock("../services/ApiService");
jest.mock("../services/AuthService");

describe("MainLayout", () => {
  const mockApiService = new ApiService(
    {} as any,
    "",
    true
  ) as jest.Mocked<ApiService>;
  const mockAuthService = new AuthService("", "") as jest.Mocked<AuthService>;
  const mockOnLogout = jest.fn();

  const mockItems = [
    {
      id: "1",
      createdAt: Date.now(),
      processingStatus: ProcessingStatus.FINISHED,
    },
    {
      id: "2",
      createdAt: Date.now(),
      processingStatus: ProcessingStatus.IN_PROGRESS,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
    mockApiService.getAllItems.mockResolvedValue(mockItems);
    mockAuthService.getCurrentUserInfo.mockReturnValue({
      username: "testuser",
      email: "test@example.com",
    });
  });

  it("loads and displays items", async () => {
    render(
      <ThemeProvider>
        <MainLayout
          apiService={mockApiService}
          authService={mockAuthService}
          onLogout={mockOnLogout}
        />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(mockApiService.getAllItems).toHaveBeenCalled();
      expect(screen.getByText(/finished/i)).toBeInTheDocument();
      expect(screen.getByText("in progress")).toBeInTheDocument();
    });
  });

  it("loads item details when clicked", async () => {
    const mockDetails = {
      audio: "base64audio",
      transcription: "Test transcription",
      processingStatus: ProcessingStatus.FINISHED,
    };

    mockApiService.getItemDetails.mockResolvedValueOnce(mockDetails);

    render(
      <ThemeProvider>
        <MainLayout
          apiService={mockApiService}
          authService={mockAuthService}
          onLogout={mockOnLogout}
        />
      </ThemeProvider>
    );

    await waitFor(() => {
      const firstItem = screen.getByText("finished");
      fireEvent.click(firstItem);
    });

    await waitFor(() => {
      expect(mockApiService.getItemDetails).toHaveBeenCalledWith("1");
      expect(
        screen.getByText("Test transcription", { selector: ".text-sm" })
      ).toBeInTheDocument();
      expect(
        screen.getByText("Test transcription", { selector: ".bg-gray-50" })
      ).toBeInTheDocument();
    });
  });
});
