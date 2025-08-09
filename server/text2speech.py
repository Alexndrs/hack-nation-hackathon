from elevenlabs.client import ElevenLabs
from elevenlabs import play, VoiceSettings
from typing import IO
from io import BytesIO

from dotenv import load_dotenv
import os

load_dotenv()

api_key = os.getenv("TTS_KEY") # api_key = "sk_78c5a73709e2a2651372fcc73cc105e46b61179a5f894d65" #clé de Julien


Text = "Bienvenue à votre séance sportive ! Aujourd'hui, nous allons travailler sur votre endurance et votre force. Commençons par un échauffement léger pour préparer vos muscles."

elevenlabs = ElevenLabs(
  api_key=api_key
)

def text2speechstream(Text):
    audio = elevenlabs.text_to_speech.stream(
        text=Text,
        voice_id="JBFqnCBsd6RMkjVDRZzb",
        model_id="eleven_flash_v2_5",
        output_format="mp3_44100_128",
        voice_settings=VoiceSettings(
            stability=0.0,
            similarity_boost=1.0,
            style=0.0,
            use_speaker_boost=True,
            speed=1.0,
        ),
    )
    #play(audio)
    # Create a BytesIO object to hold the audio data in memory
    audio_stream = BytesIO()
    # Write each chunk of audio data to the stream
    for chunk in audio:
        if chunk:
            audio_stream.write(chunk)
    # Reset stream position to the beginning
    audio_stream.seek(0)
    # Return the stream for further use
    return audio_stream

res = text2speechstream(Text)
