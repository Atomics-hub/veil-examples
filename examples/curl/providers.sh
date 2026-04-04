#!/bin/bash
# Using different providers — same endpoint, different header

# OpenAI (default)
curl -X POST https://veil-api.com/v1/chat/completions \
  -H "Authorization: Bearer $VEIL_API_KEY" \
  -H "x-upstream-key: $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "gpt-4o-mini", "messages": [{"role": "user", "content": "Hi from OpenAI via Veil"}]}'

# Together AI
curl -X POST https://veil-api.com/v1/chat/completions \
  -H "Authorization: Bearer $VEIL_API_KEY" \
  -H "x-upstream-key: $TOGETHER_API_KEY" \
  -H "x-upstream-provider: together" \
  -H "Content-Type: application/json" \
  -d '{"model": "meta-llama/Llama-3-8b-chat-hf", "messages": [{"role": "user", "content": "Hi from Together via Veil"}]}'

# Groq
curl -X POST https://veil-api.com/v1/chat/completions \
  -H "Authorization: Bearer $VEIL_API_KEY" \
  -H "x-upstream-key: $GROQ_API_KEY" \
  -H "x-upstream-provider: groq" \
  -H "Content-Type: application/json" \
  -d '{"model": "llama-3.1-8b-instant", "messages": [{"role": "user", "content": "Hi from Groq via Veil"}]}'

# See all providers: curl https://veil-api.com/v1/providers
