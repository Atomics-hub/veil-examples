"""Basic Veil AI Firewall + OpenAI example."""
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["OPENAI_API_KEY"],
    base_url="https://veil-api.com/v1",
    default_headers={
        "Authorization": f"Bearer {os.environ['VEIL_API_KEY']}",
        "x-upstream-key": os.environ["OPENAI_API_KEY"],
        "x-veil-input-policy": "block",
        "x-veil-output-policy": "monitor",
    },
)

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {
            "role": "user",
            "content": (
                "Summarize this support ticket:\n\n"
                "From: Sarah Johnson (sarah.j@acme.com)\n"
                "Phone: 408-555-7721\n"
                "SSN: 521-03-8847\n"
                "Card: 4111111111111111\n\n"
                "Issue: Charged twice for Premium subscription."
            ),
        }
    ],
)

print(response.choices[0].message.content)
