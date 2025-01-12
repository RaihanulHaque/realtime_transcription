import React from "react";
import styled from "styled-components";
import { TranscriptionOutputProps } from "../../types";

const OutputContainer = styled.div`
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  min-height: 200px;
  background-color: #f9f9f9;
`;

const TranscriptionText = styled.div`
  white-space: pre-wrap;
  line-height: 1.5;
`;

const LoadingIndicator = styled.div`
  text-align: center;
  color: #666;
`;

const TranscriptionOutput: React.FC<TranscriptionOutputProps> = ({
  transcriptions,
  isLoading,
}) => {
  return (
    <OutputContainer>
      {isLoading ? (
        <LoadingIndicator>Processing audio...</LoadingIndicator>
      ) : (
        <TranscriptionText>
          {transcriptions.map((t, index) => (
            <div key={t.timestamp}>{t.text}</div>
          ))}
        </TranscriptionText>
      )}
    </OutputContainer>
  );
};

export default TranscriptionOutput;
