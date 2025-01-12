import React from "react";
import styled from "styled-components";
import { AudioRecorderProps } from "../../types";

const RecordButton = styled.button<{ isRecording: boolean }>`
  padding: 12px 24px;
  border-radius: 25px;
  border: none;
  background-color: ${(props) => (props.isRecording ? "#ff4444" : "#4CAF50")};
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onStart,
  onStop,
  isRecording,
}) => {
  const handleClick = () => {
    if (isRecording) {
      onStop();
    } else {
      onStart();
    }
  };

  return (
    <RecordButton onClick={handleClick} isRecording={isRecording}>
      {isRecording ? "Stop Recording" : "Start Recording"}
    </RecordButton>
  );
};

export default AudioRecorder;
