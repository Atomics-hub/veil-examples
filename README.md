# Veil Examples

Examples for integrating with the hosted [Veil API](https://veil-api.com).

Veil lets you send prompts through a privacy layer before they reach OpenAI or another provider. Sensitive data is redacted on the way out and restored on the response back.

This repo is intentionally public and intentionally limited:
- It shows how to use Veil
- It does not include Veil's backend or internal implementation

## Why Veil

- Keep names, emails, phone numbers, SSNs, and other sensitive values out of upstream LLM requests
- Keep your existing provider and model choices
- Use an OpenAI-compatible API surface
- Start with a hosted product instead of building your own redaction layer

## Get Started

1. Sign up at [veil-api.com](https://veil-api.com)
2. Get a Veil API key
3. Keep your own upstream provider key
4. Point your client at `https://veil-api.com/v1`

## Required Headers

- `Authorization: Bearer <VEIL_API_KEY>`
- `x-upstream-key: <YOUR_PROVIDER_KEY>`
- Optional: `x-upstream-provider: openai|groq|together|mistral|...`

## Environment Variables

```bash
export VEIL_API_KEY=your_veil_key
export OPENAI_API_KEY=your_provider_key
```

## Quick Example: Python

```python
from openai import OpenAI
import os

client = OpenAI(
    api_key=os.environ["OPENAI_API_KEY"],
    base_url="https://veil-api.com/v1",
    default_headers={
        "Authorization": f"Bearer {os.environ['VEIL_API_KEY']}",
        "x-upstream-key": os.environ["OPENAI_API_KEY"],
    },
)

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {
            "role": "user",
            "content": "Summarize: Customer Jane Doe (jane@company.com) called from 555-123-4567.",
        }
    ],
)

print(response.choices[0].message.content)
```

## Quick Example: JavaScript

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://veil-api.com/v1',
  defaultHeaders: {
    Authorization: `Bearer ${process.env.VEIL_API_KEY}`,
    'x-upstream-key': process.env.OPENAI_API_KEY,
  },
});

const response = await client.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    {
      role: 'user',
      content: 'Summarize: Customer Jane Doe (jane@company.com) called from 555-123-4567.',
    },
  ],
});

console.log(response.choices[0].message.content);
```

## Quick Example: cURL

```bash
curl -X POST https://veil-api.com/v1/chat/completions \
  -H "Authorization: Bearer $VEIL_API_KEY" \
  -H "x-upstream-key: $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [
      {
        "role": "user",
        "content": "Summarize: Customer Jane Doe (jane@company.com) called from 555-123-4567."
      }
    ]
  }'
```

## Example Files

- [examples/python/basic.py](examples/python/basic.py)
- [examples/python/streaming.py](examples/python/streaming.py)
- [examples/python/redact_only.py](examples/python/redact_only.py)
- [examples/python/multi_provider.py](examples/python/multi_provider.py)
- [examples/javascript/basic.mjs](examples/javascript/basic.mjs)
- [examples/javascript/streaming.mjs](examples/javascript/streaming.mjs)
- [examples/curl/basic.sh](examples/curl/basic.sh)
- [examples/curl/redact.sh](examples/curl/redact.sh)
- [examples/curl/providers.sh](examples/curl/providers.sh)

## Docs

- Product site: [veil-api.com](https://veil-api.com)
- API docs: [veil-api.com/docs](https://veil-api.com/docs)
- Providers list: [veil-api.com/v1/providers](https://veil-api.com/v1/providers)

## Hosted Product

Veil is a hosted API product. This repo is examples-only and does not include the private backend, infrastructure, detection pipeline, or internal operations code.
