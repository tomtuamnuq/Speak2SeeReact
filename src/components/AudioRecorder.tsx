import { useRef, useState, useEffect } from "react";
import { ProcessingItem } from "../../shared/types";
import ApiService from "../services/ApiService";
import { AlertCircle, InfoIcon, Mic, Square } from "lucide-react";
import { SPOKEN_LANGUAGE_CODE } from "../../shared/limits";

interface AudioRecorderProps {
  apiService: ApiService;
  onUploadSuccess: (item: ProcessingItem) => void;
}

const MAX_RECORDING_TIME = 60; // seconds
const languageDisplay =
  SPOKEN_LANGUAGE_CODE === "en-US" ? "English" : SPOKEN_LANGUAGE_CODE;

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  apiService,
  onUploadSuccess,
}) => {
  const [recording, setRecording] = useState(false);
  const [hasUploaded, setHasUploaded] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordedBlobRef = useRef<Blob | null>(null);
  const timerRef = useRef<number>();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (recording) {
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= MAX_RECORDING_TIME) {
            stopRecording();
            return MAX_RECORDING_TIME;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => {
      clearInterval(timerRef.current);
    };
  }, [recording]);

  const startRecording = () => {
    setError(null);
    setRecordingTime(0);
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
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.start();
        setRecording(true);
      })
      .catch((err) => {
        console.error("Error accessing microphone:", err);
        setError(
          "Could not access microphone. Please check your browser permissions."
        );
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
        setError(null);
        const result = await apiService.uploadAudio(recordedBlobRef.current);
        onUploadSuccess(result);
        setHasUploaded(true);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Failed to upload recording. Please try again.");
        }
      }
    }
  };

  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60)
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Record Audio
      </h2>

      {/* Recording limits info */}
      <div className="mb-6 flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <InfoIcon className="w-4 h-4" />
        <span>
          Maximum recording time: {MAX_RECORDING_TIME} seconds (up to 3MB)
        </span>
      </div>
      <div className="mb-6 flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <AlertCircle className="w-4 h-4" />
        <span>Please speak in {languageDisplay} for best results</span>
      </div>

      <div className="space-y-6">
        {/* Recording timer */}
        {recording && (
          <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {formatTime(recordingTime)} / {formatTime(MAX_RECORDING_TIME)}
          </div>
        )}
        <div className="flex justify-center">
          <button
            onClick={recording ? stopRecording : startRecording}
            className={`p-8 rounded-full transition-all duration-200 ${
              recording
                ? "bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50"
                : "bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50"
            }`}
          >
            {recording ? (
              <Square className="w-8 h-8 text-red-600 dark:text-red-400" />
            ) : (
              <Mic className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg">
            {error}
          </div>
        )}

        {previewUrl && !error && (
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <audio controls className="w-full" data-testid="audio-player">
              <source src={previewUrl} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {recordedBlobRef.current && !hasUploaded && !error && (
          <button
            onClick={handleUpload}
            className="px-6 py-3 rounded-lg font-medium transition-all duration-200 bg-green-500 hover:bg-green-600 text-white"
          >
            Upload Recording
          </button>
        )}

        {hasUploaded && (
          <div className="text-green-600 bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
            Audio uploaded successfully. Record a new audio to upload again.
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;
