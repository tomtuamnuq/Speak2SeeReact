import { ProcessingStatus } from "../../shared/common-utils";
import ProcessingStatusComponent from "./ProcessingStatusComponent";

export interface Item {
  id: string;
  createdAt: number;
  processingStatus: ProcessingStatus;
  audio?: string;
  transcription?: string;
  image?: string;
  prompt?: string;
  detailsLoaded: boolean;
}
interface ItemDetailsViewProps {
  details?: Item;
  status?: ProcessingStatus;
}
const ItemDetailsView: React.FC<ItemDetailsViewProps> = ({
  details,
  status,
}) => {
  if (!details) {
    return (
      <div
        className="flex items-center justify-center p-12"
        data-testid="loading-spinner"
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Item Details
        </h2>
        <ProcessingStatusComponent
          status={status || details.processingStatus}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
        {details.prompt && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
              Generated Prompt
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 dark:bg-gray-900/50 rounded-lg p-4 text-gray-700 dark:text-gray-300">
              {details.prompt}
            </div>
          </div>
        )}

        {details.transcription && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
              Transcription
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 dark:bg-gray-900/50 rounded-lg p-4 text-gray-700 dark:text-gray-300">
              {details.transcription}
            </div>
          </div>
        )}

        {details.image && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
              Generated Image
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 dark:bg-gray-900/50 rounded-lg p-4 text-gray-700 dark:text-gray-300">
              <img
                src={`data:image/jpeg;base64,${details.image}`}
                alt="Generated"
                className="max-w-2xl rounded-lg shadow-sm mx-auto"
              />
            </div>
          </div>
        )}

        {details.audio && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">
              Audio Recording
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <audio controls className="w-full" data-testid="audio-player">
                <source
                  src={`data:audio/wav;base64,${details.audio}`}
                  type="audio/wav"
                />
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
        )}
      </div>

      {details.processingStatus === ProcessingStatus.IN_PROGRESS && (
        <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 p-4 rounded-lg text-sm">
          Processing in progress... Please reselect the item to update the
          content.
        </div>
      )}
    </div>
  );
};

export default ItemDetailsView;
