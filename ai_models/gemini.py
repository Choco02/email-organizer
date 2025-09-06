from google import genai
from google.genai import types

from .inital_prompt import instructions_pt

ai_client = genai.Client()

def ask(contents):
    response = ai_client.models.generate_content(
        model="gemini-2.5-flash",
        contents=contents,
        config=types.GenerateContentConfig(
            thinking_config=types.ThinkingConfig(thinking_budget=0),
            system_instruction=instructions_pt
        )

    )
    return response.text
