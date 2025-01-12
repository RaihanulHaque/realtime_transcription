# transcription/consumers.py

import json
from channels.generic.websocket import AsyncWebsocketConsumer

class TranscriptionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        print("WebSocket connected!")

    async def disconnect(self, close_code):
        print("WebSocket disconnected!")

    async def receive(self, text_data):
        try:
            # Here you'll receive audio data from the client
            text_data_json = json.loads(text_data)
            audio_data = text_data_json.get('audio')
            
            # For now, just echo back a message
            # Later, we'll add actual transcription logic
            await self.send(text_data=json.dumps({
                'message': 'Received audio chunk',
                'transcript': 'Sample transcription'
            }))
        except Exception as e:
            await self.send(text_data=json.dumps({
                'error': str(e)
            }))