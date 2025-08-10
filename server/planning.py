from groq import Groq
from text2speech import text2speechstream
import os
from dotenv import load_dotenv

goal = "run 120 kilometers within 2 weeks" #adapter avec un type d'entrée différent (tableau, liste, nbre de kilomètres ...)
load_dotenv()
GROQ_API_KEY = os.getenv("groq_api_key")

def planning(goal):
    client = Groq(api_key=GROQ_API_KEY)
    planning = client.chat.completions.create(
        
        messages=[
            # Set an optional system message. This sets the behavior of the
            # assistant and can be used to provide specific instructions for
            # how it should behave throughout the conversation.
            {
                "role": "system",
                "content": "You are a helpful coach who seeks to help the user to achieve its goals in running. The user will give you its goal, return a planning on this format : day| activity|duration|distance|pace. The planning should be adapted to the user level and the goal.",
            },
            {
                "role": "user",
                "content": goal,
            }
        ],

        # The language model which will generate the completion.
        model="llama-3.3-70b-versatile")
    planning = planning.choices[0].message.content
    #print(planning)
    #print("eeeeeeeeeeeeeeeeeeeeeeeee")
    client = Groq(api_key=api_key)
    planning_vocal = client.chat.completions.create(
        messages=[
            {
                "role": "system",
        "content": "You are a helpful coach who seeks to help the user to achieve its goals in running. I will give you a planning, return a complete summary of the planning in a few words in a format that can be used for text to speech. ",
            },
            {
                "role": "user",
                "content": planning,
            }
        ],

        model="llama-3.3-70b-versatile")
    planning_vocal = planning_vocal.choices[0].message.content
    #print(planning_vocal)
    audio_stream = text2speechstream(planning_vocal)
    return audio_stream, planning

planning_audio, planning_text = planning(goal)
