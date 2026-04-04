# Veil — PII Redaction for LLM APIs

Drop-in proxy that strips personally identifiable information before it reaches any LLM provider. One line of code. Full restoration on the response.

**Live API:** [https://veil-api-728549458468.us-central1.run.app](https://veil-api-728549458468.us-central1.run.app)

## Quick Start

### Python (OpenAI SDK)

```python
from openai import OpenAI

client = OpenAI(
    api_key="your-openai-key",
    base_url="https://veil-api-728549458468.us-central1.run.app/v1",
    default_headers={
        "Authorization": "Bearer your-veil-key",
        "x-upstream-key": "your-openai-key",
    }
)

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Summarize: Customer John Smith (john@test.com, SSN 123-45-6789) wants a refund."}]
)

# Response contains "John Smith" and "john@test.com" — restored automatically.
# OpenAI never saw the real data.
print(response.choices[0].message.content)
print(response.veil)  # {"entities_redacted": 3, "entity_types": ["PERSON", "EMAIL_ADDRESS", "US_SSN"]}
```

### JavaScript (OpenAI SDK)

```javascript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://veil-api-728549458468.us-central1.run.app/v1',
  defaultHeaders: {
    'Authorization': `Bearer ${process.env.VEIL_API_KEY}`,
    'x-upstream-key': process.env.OPENAI_API_KEY,
  }
});

const response = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: 'Summarize: Customer Jane Doe (jane@test.com) called from 555-123-4567.' }]
});

console.log(response.choices[0].message.content);
```

### cURL

```bash
curl -X POST https://veil-api-728549458468.us-central1.run.app/v1/chat/completions \
  -H "Authorization: Bearer your-veil-key" \
  -H "x-upstream-key: your-openai-key" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [{"role": "user", "content": "Hi, I am Tom Ryan (tom@test.com). Help me with my account."}]
  }'
```

### Standalone Redaction (no LLM call)

```bash
curl -X POST https://veil-api-728549458468.us-central1.run.app/v1/redact \
  -H "Authorization: Bearer your-veil-key" \
  -H "Content-Type: application/json" \
  -d '{"text": "Contact Sarah at sarah@company.com, SSN 078-05-1120, card 4111111111111111"}'
```

Response:
```json
{
  "redacted": "Contact <<VEIL_PERSON_a8f2>> at <<VEIL_EMAIL_c3d1>>, SSN <<VEIL_SSN_9e7b>>, card <<VEIL_CC_b1e8>>",
  "entities_found": 4,
  "entity_types": ["PERSON", "EMAIL_ADDRESS", "US_SSN", "CREDIT_CARD"]
}
```

## Using with Other Providers

Set the `x-upstream-provider` header to route through any provider:

```python
# Together AI
client = OpenAI(
    base_url="https://veil-api-728549458468.us-central1.run.app/v1",
    default_headers={
        "Authorization": "Bearer your-veil-key",
        "x-upstream-key": "your-together-key",
        "x-upstream-provider": "together",
    }
)

# Groq
# x-upstream-provider: groq

# Fireworks AI
# x-upstream-provider: fireworks

# Mistral
# x-upstream-provider: mistral

# DeepSeek
# x-upstream-provider: deepseek

# Or any custom endpoint:
# x-upstream-provider: https://your-custom-llm.com
```

## Supported Providers

OpenAI, Anthropic, Google Gemini, Mistral, Cohere, xAI, AI21, Together, Groq, Fireworks, OpenRouter, Perplexity, Cerebras, SambaNova, Lepton, Nebius, Novita, Hyperbolic, Lambda, DeepInfra, DeepSeek, Moonshot, Zhipu, Yi, Baichuan, Stepfun, MiniMax, Qwen, SiliconFlow, Replicate, Baseten, HuggingFace, Portkey, Helicone, Codestral — or any custom `https://` URL.

## Streaming

Works exactly like the OpenAI SDK streaming — just add `stream=True`:

```python
stream = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Customer John Smith (john@test.com) needs help."}],
    stream=True
)

for chunk in stream:
    content = chunk.choices[0].delta.content
    if content:
        print(content, end="")  # PII restored in real-time
```

## What Gets Redacted

75+ entity types across 12 countries. PII, secrets, and crypto.

**Personal Information**
| Entity | Example | Redacted As |
|--------|---------|-------------|
| Person names | Sarah Johnson | `<<VEIL_PERSON_a8f2>>` |
| Email addresses | sarah@test.com | `<<VEIL_EMAIL_ADDRESS_c3d1>>` |
| Phone numbers | 555-867-5309 | `<<VEIL_PHONE_NUMBER_4f2a>>` |
| SSN | 078-05-1120 | `<<VEIL_US_SSN_9e7b>>` |
| Credit cards | 4111111111111111 | `<<VEIL_CREDIT_CARD_b1e8>>` |
| IP addresses | 192.168.1.1 | `<<VEIL_IP_ADDRESS_d4c2>>` |
| Addresses | 742 Evergreen Terrace | `<<VEIL_LOCATION_f3a1>>` |
| Passports | US, UK, DE, IT, IN, KR | `<<VEIL_*_PASSPORT_...>>` |
| Driver's licenses | US, DE, IT, KR | `<<VEIL_*_DRIVER_LICENSE_...>>` |
| National IDs | UK NINO, DE ID, IT Fiscal, IN Aadhaar, PL PESEL, SG NRIC, etc. | `<<VEIL_*_...>>` |

**Secrets & API Keys**
| Entity | Example | Redacted As |
|--------|---------|-------------|
| AWS access keys | AKIAIOSFODNN7EXAMPLE | `<<VEIL_API_KEY_...>>` |
| GitHub tokens | ghp_xxxx... | `<<VEIL_API_KEY_...>>` |
| Stripe keys | sk_live_xxxx... | `<<VEIL_API_KEY_...>>` |
| GCP API keys | AIzaxxxx... | `<<VEIL_API_KEY_...>>` |
| Slack tokens | xoxb-xxxx... | `<<VEIL_API_KEY_...>>` |
| JWTs | eyJhbG... | `<<VEIL_API_KEY_...>>` |
| Private keys | -----BEGIN RSA PRIVATE KEY----- | `<<VEIL_API_KEY_...>>` |

**Crypto Wallets**
| Entity | Example | Redacted As |
|--------|---------|-------------|
| Ethereum | 0x742d35Cc... | `<<VEIL_CRYPTO_WALLET_...>>` |
| Bitcoin (bech32) | bc1qar0... | `<<VEIL_CRYPTO_WALLET_...>>` |
| Litecoin | Lxxxx... | `<<VEIL_CRYPTO_WALLET_...>>` |
| Monero | 4xxxx... | `<<VEIL_CRYPTO_WALLET_...>>` |

## Evasion Resistance

Veil doesn't just use regex. It includes:

- **Unicode normalization** — catches zero-width character injection (`T​om` → `Tom`)
- **Homoglyph detection** — catches Cyrillic/Greek lookalikes (`Tоm` with Cyrillic о → `Tom`)
- **Accent normalization** — catches `José` → `Jose` for NER matching
- **Microsoft Presidio NER** — ML-based named entity recognition, not just pattern matching

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v1/chat/completions` | POST | OpenAI-compatible proxy with PII redaction |
| `/v1/redact` | POST | Standalone text redaction (no LLM call) |
| `/v1/usage` | GET | Usage statistics for your API key |
| `/v1/billing/checkout` | POST | Create Stripe checkout session |
| `/health` | GET | Health check |

## Pricing

| Plan | Price | Requests/month |
|------|-------|---------------|
| Free | $0 | 100 |
| Starter | $49/mo | 10,000 |
| Growth | $149/mo | 100,000 |
| Enterprise | $499/mo | 1,000,000+ |

## License

Examples are MIT licensed. The Veil API server is proprietary.
