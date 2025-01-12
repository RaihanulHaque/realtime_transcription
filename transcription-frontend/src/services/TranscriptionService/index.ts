import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";
import { TranscriptionResult } from "../../types";

class TranscriptionService {
  private connection: HubConnection | null = null;
  private onTranscriptionCallback:
    | ((result: TranscriptionResult) => void)
    | null = null;

  async connect(token: string): Promise<void> {
    try {
      this.connection = new HubConnectionBuilder()
        .withUrl(`${process.env.REACT_APP_API_URL}/ws/transcribe`, {
          accessTokenFactory: () => token,
        })
        .withAutomaticReconnect()
        .build();

      this.connection.on("ReceiveTranscription", (transcription: string) => {
        if (this.onTranscriptionCallback) {
          this.onTranscriptionCallback({
            text: transcription,
            timestamp: Date.now(),
          });
        }
      });

      await this.connection.start();
    } catch (error) {
      console.error("Connection failed:", error);
      throw error;
    }
  }

  setTranscriptionCallback(
    callback: (result: TranscriptionResult) => void
  ): void {
    this.onTranscriptionCallback = callback;
  }

  async sendAudioChunk(chunk: Blob): Promise<void> {
    if (this.connection?.state === "Connected") {
      try {
        await this.connection.invoke("SendAudio", chunk);
      } catch (error) {
        console.error("Error sending audio chunk:", error);
        throw error;
      }
    }
  }

  disconnect(): void {
    this.connection?.stop();
  }
}

export default new TranscriptionService();
