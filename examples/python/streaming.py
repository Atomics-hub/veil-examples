"""Streaming example — tokens arrive in real-time with PII restored inline."""
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["OPENAI_API_KEY"],
    base_url="https://veil-api.com/v1",
    default_headers={
        "Authorization": f"Bearer {os.environ['VEIL_API_KEY']}",
        "x-upstream-key": os.environ["OPENAI_API_KEY"],
    },
)

stream = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {
            "role": "user",
            "content": "Write a formal reply to: Dear support, I am Tom Ryan (tom@example.com, 555-867-5309) and I need help with my account.",
        }
    ],
    stream=True,
)

for chunk in stream:
    content = chunk.choices[0].delta.content
    if content:
        print(content, end="", flush=True)

print()
