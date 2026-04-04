"""Standalone redaction — strip PII without making an LLM call."""
import os
import requests

response = requests.post(
    "https://veil-api.com/v1/redact",
    headers={"Authorization": f"Bearer {os.environ['VEIL_API_KEY']}"},
    json={
        "text": (
            "Patient: Maria Garcia (maria.g@hospital.org)\n"
            "DOB: 03/15/1985\n"
            "SSN: 078-05-1120\n"
            "Insurance ID: BC-9928174\n"
            "Address: 2847 Oak Boulevard, San Jose, CA 95134\n"
            "Phone: 408-555-0199\n"
            "Emergency contact: Carlos Garcia, 408-555-0200"
        )
    },
)

data = response.json()
print("Redacted text:")
print(data["redacted"])
print(f"\nEntities found: {data['entities_found']}")
print(f"Types: {data['entity_types']}")
