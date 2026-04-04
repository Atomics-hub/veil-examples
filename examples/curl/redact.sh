#!/bin/bash
# Standalone redaction — no LLM call

curl -X POST https://veil-api-728549458468.us-central1.run.app/v1/redact \
  -H "Authorization: Bearer $VEIL_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Contact Sarah Johnson at sarah@acme.com. SSN: 078-05-1120. Phone: 555-867-5309. Card: 4111111111111111. Address: 742 Evergreen Terrace, Springfield."
  }'
