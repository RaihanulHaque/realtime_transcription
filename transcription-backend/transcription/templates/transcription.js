document.getElementById("recordButton").addEventListener("click", function () {
  startRecording();
});

function startRecording() {
  // Simulate recording animation
  const recordButton = document.getElementById("recordButton");
  recordButton.textContent = "Recording...";
  recordButton.disabled = true;

  // Simulate a delay for recording
  setTimeout(() => {
    transcriptionReceive();
    recordButton.textContent = "Start Recording";
    recordButton.disabled = false;
  }, 3000); // Simulate a 3-second recording
}

function transcriptionReceive() {
  // Simulate receiving transcription
  const transcriptionText = "hello"; // Placeholder for actual transcription
  document.getElementById("transcription").textContent = transcriptionText;
}
