import { render, screen } from "@testing-library/react";
import AudioRecorder from "./AudioRecorder";
import ApiService from "../services/ApiService";
import "@testing-library/jest-dom";

jest.mock("../services/ApiService");

describe("AudioRecorder", () => {
  const mockApiService = new ApiService(
    {} as any,
    "",
    true
  ) as jest.Mocked<ApiService>;
  const mockOnUploadSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(global.navigator, "mediaDevices", {
      value: {
        getUserMedia: jest.fn().mockResolvedValue({
          getTracks: () => [{ stop: jest.fn() }],
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
        }),
      },
      writable: true,
    });
  });

  it("renders recording interface", () => {
    render(
      <AudioRecorder
        apiService={mockApiService}
        onUploadSuccess={mockOnUploadSuccess}
      />
    );

    expect(screen.getByText("Start Recording")).toBeInTheDocument();
  });
});
