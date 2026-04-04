// Basic Veil + OpenAI example — PII redacted before reaching GPT.
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://veil-api.com/v1',
  defaultHeaders: {
    'Authorization': `Bearer ${process.env.VEIL_API_KEY}`,
    'x-upstream-key': process.env.OPENAI_API_KEY,
  }
});

const response = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [{
    role: 'user',
    content: `Summarize this ticket:
From: Jane Doe (jane@company.com)
Phone: 555-123-4567
SSN: 123-45-6789
Issue: Double charged $299.99 for Premium plan.`
  }]
});

console.log(response.choices[0].message.content);
