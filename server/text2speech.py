from elevenlabs.client import ElevenLabs
from elevenlabs import play

from dotenv import load_dotenv
import os

load_dotenv()

api_key = os.getenv("TTS_KEY") # api_key = "sk_78c5a73709e2a2651372fcc73cc105e46b61179a5f894d65" #clé de Julien


Text = "Bienvenue à votre séance sportive ! Aujourd'hui, nous allons travailler sur votre endurance et votre force. Commençons par un échauffement léger pour préparer vos muscles."

elevenlabs = ElevenLabs(
  api_key=api_key
)

def text2speech(Text):
    audio = elevenlabs.text_to_speech.convert(
        text=Text,
        voice_id="JBFqnCBsd6RMkjVDRZzb",
        model_id="eleven_flash_v2_5",
        output_format="mp3_44100_128",
    )
    play(audio)
    return audio

res = text2speech(Text)
