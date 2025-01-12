import { useState, useCallback } from "react";
import TranscriptionService from "../../services/TranscriptionService";

export const useAudioRecording = () => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          await TranscriptionService.sendAudioChunk(event.data);
        }
      };

      recorder.start(1000);
      setMediaRecorder(recorder);
      setIsRecording(true);
      setError(null);
    } catch (err) {
      setError("Failed to start recording");
      console.error("Recording error:", err);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  }, [mediaRecorder, isRecording]);

  return {
    isRecording,
    error,
    startRecording,
    stopRecording,
  };
};
