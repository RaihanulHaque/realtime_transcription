# # transcription/consumers.py

# import json
# from channels.generic.websocket import AsyncWebsocketConsumer

# class TranscriptionConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         await self.accept()
#         print("WebSocket connected!")

#     async def disconnect(self, close_code):
#         print("WebSocket disconnected!")

#     # async def receive(self, text_data):
#     #     try:
#     #         # Here you'll receive audio data from the client
#     #         text_data_json = json.loads(text_data)
#     #         audio_data = text_data_json.get('audio')
            
#     #         # For now, just echo back a message
#     #         # Later, we'll add actual transcription logic
#     #         await self.send(text_data=json.dumps({
#     #             'message': 'Received audio chunk',
#     #             'transcript': 'Sample transcription'
#     #         }))
#     #     except Exception as e:
#     #         await self.send(text_data=json.dumps({
#     #             'error': str(e)
#     #         }))

#     async def receive(self, text_data):
#         try:
#             text_data_json = json.loads(text_data)
#             audio_data = text_data_json.get('audio')

#             # Send audio data to your transcription API
#             # For example, using an async HTTP client like httpx
#             # response = await your_transcription_api(audio_data)

#             # Simulate a transcription response
#             transcription_result = "Transcribed text from audio"

#             await self.send(text_data=json.dumps({
#                 'message': 'Audio processed',
#                 'transcript': transcription_result
#             }))
#         except Exception as e:
#             await self.send(text_data=json.dumps({
#                 'error': str(e)
#             }))


import json
import base64
import aiohttp
from channels.generic.websocket import AsyncWebsocketConsumer

class TranscriptionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        try:
            # Parse incoming WebSocket data
            data = json.loads(text_data)
            audio_data = data.get('audio')
            username = data.get('username', 'default_user')  # Default to 'default_user' if not provided
            lang = data.get('lang', 'en')  # Default to 'en' if not provided

            if audio_data:
                # Decode the base64 audio data
                audio_bytes = base64.b64decode(audio_data)

                # Here, we will save the decoded audio to a temporary file
                file_path = '/tmp/temp_audio.mp3'  # Example temporary file path
                with open(file_path, 'wb') as f:
                    f.write(audio_bytes)

                # Send audio file path to transcription API
                response = await self.upload_payload(file_path, username, lang)

                # Check the API response for transcription
                if response.status == 200:
                    result = await response.json()
                    transcription_text = result.get('transcribedData', 'No transcription found.')

                    # Send transcription back to the WebSocket client
                    await self.send(json.dumps({
                        'type': 'transcription',
                        'text': transcription_text
                    }))
                else:
                    # Handle unsuccessful API call
                    await self.send(json.dumps({
                        'type': 'error',
                        'message': 'Transcription failed. Please try again.'
                    }))

            else:
                raise ValueError("Audio data is missing in the request.")
        
        except Exception as e:
            # Handle any errors (e.g., missing data, API issues, etc.)
            await self.send(json.dumps({
                'type': 'error',
                'message': str(e)
            }))

    async def upload_payload(self, audio_file_path, username, language):
        headers = {
            'accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'API_KEY': 'slkfsdjfjsidsfjkenfnvcjnlsdkfj',  # Replace with actual API key
        }
        payload = {
            "file_path": audio_file_path,
            "username": username,
            "lang": language,
        }

        # Sending the POST request to the FastAPI server
        fastapi_url = "http://20.244.32.168:8080/sensevoice/transcription/from_path-v2/"
        async with aiohttp.ClientSession() as session:
            async with session.post(fastapi_url, json=payload, headers=headers) as response:
                return response
