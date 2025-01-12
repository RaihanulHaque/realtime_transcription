export interface TranscriptionResult {
  text: string;
  timestamp: number;
}

export interface AudioRecorderProps {
  onStart: () => void;
  onStop: () => void;
  isRecording: boolean;
}

export interface TranscriptionOutputProps {
  transcriptions: TranscriptionResult[];
  isLoading: boolean;
}
