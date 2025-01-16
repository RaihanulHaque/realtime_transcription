# transcription/views.py
import requests
import json
from django.shortcuts import render

def index(request):
    return render(request, 'index3.html')

# def transcribe_audio(audio_file, username, language):
#     # Replace this with your own transcription API
#     headers = {
#         'accept': 'application/json',
#         'API_KEY': 'slkfsdjfjsidsfjkenfnvcjnlsdkfj',
#         'Content-Type': 'multipart/form-data',  # This will be handled automatically by requests when using 'files' parameter
#     }
    
#     file = {
#         'file': (audio_file)
#     }