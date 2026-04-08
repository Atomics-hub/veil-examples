# Veil Examples

Public integration examples for the hosted [Veil API](https://veil-api.com).

This repo is intentionally limited to client-side usage examples. It shows how to send requests through Veil, not how Veil's backend or detection engine is implemented.

## What Veil Does

Veil sits in front of your LLM provider and redacts sensitive data before it leaves your app. The provider sees placeholders. Your app gets the final response with the original values restored.

Use cases:
- Customer support tickets
- Healthcare and legal workflows
- Financial and insurance documents
- Internal copilots that handle user data

## Quick Start

1. Get a Veil API key from [veil-api.com](https://veil-api.com).
2. Keep using your own upstream provider key.
3. Point your OpenAI-compatible client at `https://veil-api.com/v1`.
4. Add your Veil key in `Authorization` and your provider key in `x-upstream-key`.

## Environment Variables

```bash
export VEIL_API_KEY=your_veil_key
export OPENAI_API_KEY=your_provider_key
```

## Included Examples

- [examples/python/basic.py](examples/python/basic.py): Basic Python example
- [examples/python/streaming.py](examples/python/streaming.py): Streaming responses
- [examples/python/redact_only.py](examples/python/redact_only.py): Redact text without an LLM call
- [examples/python/multi_provider.py](examples/python/multi_provider.py): Route to different providers
- [examples/javascript/basic.mjs](examples/javascript/basic.mjs): Basic JavaScript example
- [examples/javascript/streaming.mjs](examples/javascript/streaming.mjs): Streaming in JavaScript
- [examples/curl/basic.sh](examples/curl/basic.sh): Basic cURL example
- [examples/curl/redact.sh](examples/curl/redact.sh): Standalone redaction
- [examples/curl/providers.sh](examples/curl/providers.sh): Multi-provider routing

## Python Example

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

## JavaScript Example

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

## cURL Example

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

## Docs

- Product site: [veil-api.com](https://veil-api.com)
- API docs: [veil-api.com/docs](https://veil-api.com/docs)
- Providers list: [veil-api.com/v1/providers](https://veil-api.com/v1/providers)

## Notes

- Veil is a hosted product. This repo does not contain the private service implementation.
- The example code in this repo is MIT licensed. The Veil API service and backend are separate from these examples.
