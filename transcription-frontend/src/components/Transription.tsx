// src/components/Transcription.tsx
import React, { useState, useEffect } from "react";
import TranscriptionService from "../services/TranscriptionService";

const Transcription: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeTranscription = async () => {
      try {
        await TranscriptionService.connect("your-auth-token");
        TranscriptionService.setTranscriptionCallback((text) => {
          setTranscription((prev) => prev + " " + text);
        });
      } catch (err) {
        setError("Failed to connect to transcription service");
      }
    };

    initializeTranscription();

    return () => {
      TranscriptionService.disconnect();
    };
  }, []);

  const handleStartRecording = async () => {
    try {
      await TranscriptionService.startRecording();
      setIsRecording(true);
    } catch (err) {
      setError("Failed to start recording");
    }
  };

  const handleStopRecording = () => {
    TranscriptionService.stopRecording();
    setIsRecording(false);
  };

  return (
    <div className="transcription-container">
      {error && <div className="error-message">{error}</div>}

      <div className="controls">
        <button
          onClick={isRecording ? handleStopRecording : handleStartRecording}
          className={isRecording ? "stop" : "start"}
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
      </div>

      <div className="transcription-output">
        {transcription || "Transcription will appear here..."}
      </div>
    </div>
  );
};

export default Transcription;
