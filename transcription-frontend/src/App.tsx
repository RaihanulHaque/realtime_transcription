import React, { useEffect, useState } from "react";
import styled from "styled-components";
import AudioRecorder from "./components/AudioRecorder";
import TranscriptionOutput from "./components/TranscriptionOutput";
import { useAudioRecording } from "./hooks/useAudioRecording";
import TranscriptionService from "./services/TranscriptionService";
import { TranscriptionResult } from "./types";

const AppContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.h1`
  text-align: center;
  color: #333;
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  margin: 10px 0;
  padding: 10px;
  border-radius: 4px;
  background-color: #ffe6e6;
`;

const App: React.FC = () => {
  const [transcriptions, setTranscriptions] = useState<TranscriptionResult[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const { isRecording, error, startRecording, stopRecording } =
    useAudioRecording();

  useEffect(() => {
    const initializeTranscription = async () => {
      try {
        await TranscriptionService.connect("your-auth-token");
        TranscriptionService.setTranscriptionCallback((result) => {
          setTranscriptions((prev) => [...prev, result]);
        });
      } catch (err) {
        console.error("Failed to initialize transcription service:", err);
      }
    };

    initializeTranscription();

    return () => {
      TranscriptionService.disconnect();
    };
  }, []);

  const handleStart = async () => {
    setIsLoading(true);
    await startRecording();
  };

  const handleStop = () => {
    stopRecording();
    setIsLoading(false);
  };

  return (
    <AppContainer>
      <Header>Real-time Audio Transcription</Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <AudioRecorder
        onStart={handleStart}
        onStop={handleStop}
        isRecording={isRecording}
      />

      <TranscriptionOutput
        transcriptions={transcriptions}
        isLoading={isLoading}
      />
    </AppContainer>
  );
};

export default App;
