import { useRef, useState } from "react";
import { ProcessingItem } from "../../shared/types";
import ApiService from "../services/ApiService";

interface AudioRecorderProps {
  apiService: ApiService;
  onUploadSuccess: (item: ProcessingItem) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  apiService,
  onUploadSuccess,
}) => {
  const [recording, setRecording] = useState(false);
  const [hasUploaded, setHasUploaded] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordedBlobRef = useRef<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        setPreviewUrl(null);
        audioChunksRef.current = [];
        recordedBlobRef.current = null;
        setHasUploaded(false);
        mediaRecorder.ondataavailable = (e) => {
          audioChunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });
          const url = URL.createObjectURL(blob);
          setPreviewUrl(url);
          recordedBlobRef.current = blob;
          // Stop all tracks to release the microphone
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.start();
        setRecording(true);
      })
      .catch((err) => {
        console.error("Error accessing microphone:", err);
      });
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handleUpload = async () => {
    if (recordedBlobRef.current) {
      try {
        const result = await apiService.uploadAudio(recordedBlobRef.current);
        onUploadSuccess(result);
        setHasUploaded(true);
      } catch (error) {
        console.error("Error uploading audio:", error);
      }
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Record Audio
      </h2>
      <div className="space-y-6">
        <button
          onClick={recording ? stopRecording : startRecording}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200
            ${
              recording
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
        >
          {recording ? "Stop Recording" : "Start Recording"}
        </button>

        {previewUrl && (
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <audio controls className="w-full" data-testid="audio-player">
              <source src={previewUrl} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {recordedBlobRef.current && !hasUploaded && (
          <button
            onClick={handleUpload}
            className="px-6 py-3 rounded-lg font-medium transition-all duration-200 bg-green-500 hover:bg-green-600 text-white"
          >
            Upload Recording
          </button>
        )}

        {hasUploaded && (
          <div className="text-green-600 bg-green-50 p-4 rounded-lg">
            Audio uploaded successfully. Record a new audio to upload again.
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;
