#!/bin/bash
# Basic cURL example — proxy through Veil to OpenAI

curl -X POST https://veil-api-728549458468.us-central1.run.app/v1/chat/completions \
  -H "Authorization: Bearer $VEIL_API_KEY" \
  -H "x-upstream-key: $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [
      {"role": "user", "content": "Summarize: Customer John Smith (john@test.com, SSN 123-45-6789) wants a refund."}
    ]
  }'
