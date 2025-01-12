// src/services/TranscriptionService.ts
import { HubConnectionBuilder, HubConnection } from "@microsoft/signalr";

class TranscriptionService {
  private connection: HubConnection | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private onTranscriptionCallback: ((text: string) => void) | null = null;

  async connect(token: string) {
    this.connection = new HubConnectionBuilder()
      .withUrl(`${process.env.REACT_APP_API_URL}/ws/transcribe`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    this.connection.on("ReceiveTranscription", (transcription: string) => {
      if (this.onTranscriptionCallback) {
        this.onTranscriptionCallback(transcription);
      }
    });

    await this.connection.start();
  }

  setTranscriptionCallback(callback: (text: string) => void) {
    this.onTranscriptionCallback = callback;
  }

  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);

      this.mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0 && this.connection?.state === "Connected") {
          await this.connection.invoke("SendAudio", event.data);
        }
      };

      this.mediaRecorder.start(1000);
    } catch (error) {
      console.error("Error starting recording:", error);
      throw error;
    }
  }

  stopRecording() {
    this.mediaRecorder?.stop();
  }

  disconnect() {
    this.connection?.stop();
  }
}

export default new TranscriptionService();
