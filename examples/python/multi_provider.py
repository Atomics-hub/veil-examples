"""Using Veil with different LLM providers — same code, swap one header."""
import os
from openai import OpenAI

VEIL_BASE = "https://veil-api-728549458468.us-central1.run.app/v1"
VEIL_KEY = os.environ["VEIL_API_KEY"]

prompt = "Summarize: Customer John Smith (john@test.com) wants a refund for order #12345."

providers = [
    ("openai", os.environ.get("OPENAI_API_KEY", ""), "gpt-4o-mini"),
    ("together", os.environ.get("TOGETHER_API_KEY", ""), "meta-llama/Llama-3-8b-chat-hf"),
    ("groq", os.environ.get("GROQ_API_KEY", ""), "llama-3.1-8b-instant"),
]

for provider, key, model in providers:
    if not key:
        print(f"Skipping {provider} (no API key)")
        continue

    client = OpenAI(
        api_key=key,
        base_url=VEIL_BASE,
        default_headers={
            "Authorization": f"Bearer {VEIL_KEY}",
            "x-upstream-key": key,
            "x-upstream-provider": provider,
        },
    )

    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
    )

    print(f"[{provider} / {model}]")
    print(response.choices[0].message.content[:150])
    print()
