import os
import signal
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs
from elevenlabs.conversational_ai.conversation import Conversation
from elevenlabs.conversational_ai.default_audio_interface import DefaultAudioInterface

# Load credentials from .env
load_dotenv()
agent_id = os.getenv("TRAINING_COACH_ID")
api_key = os.getenv("TTS_KEY")

if not agent_id:
    raise ValueError("Please set AGENT_ID in your .env file")
# Note: API key is only required for private agents
elevenlabs = ElevenLabs(api_key=api_key)  # If public agent, api_key can be None :contentReference[oaicite:0]{index=0}

# Set up the conversation with audio interface and callbacks
conversation = Conversation(
    elevenlabs,
    agent_id,
    requires_auth=bool(api_key),
    audio_interface=DefaultAudioInterface(),  # Uses system mic/speakers by default
    callback_agent_response=lambda response: print(f"Agent says: {response}"),
    callback_agent_response_correction=lambda orig, corr: print(f"Agent corrected: {orig} → {corr}"),
    callback_user_transcript=lambda transcript: print(f"You said: {transcript}"),
)

# Graceful exit on Ctrl+C
signal.signal(signal.SIGINT, lambda sig, frame: conversation.end_session())

print("Starting conversation…")
conversation.start_session()  # optional user ID
conversation_id = conversation.wait_for_session_end()
print(f"Conversation ended. Conversation ID: {conversation_id}")
