import { render, screen } from "@testing-library/react";
import ItemDetailsView from "./ItemDetailsView";
import { ProcessingStatus } from "../../shared/common-utils";
import "@testing-library/jest-dom";

describe("ItemDetailsView", () => {
  const mockDetails = {
    id: "1",
    createdAt: Date.now(),
    detailsLoaded: true,
    audio: "base64audio",
    transcription: "Test transcription",
    image: "base64image",
    processingStatus: ProcessingStatus.FINISHED,
  };

  it("displays loading state when no details provided", () => {
    render(<ItemDetailsView />);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("renders item details when provided", () => {
    render(<ItemDetailsView details={mockDetails} />);

    expect(screen.getByText("Test transcription")).toBeInTheDocument();
    expect(screen.getByTestId("audio-player")).toBeInTheDocument();
    expect(screen.getByRole("img")).toBeInTheDocument();
    expect(screen.getByText("finished")).toBeInTheDocument();
  });
});
