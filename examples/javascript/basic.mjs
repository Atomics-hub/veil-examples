// Basic Veil AI Firewall + OpenAI example.
import OpenAI from 'openai';
import { createVeilOpenAIConfig } from 'a5omic-veil';

const openai = new OpenAI(createVeilOpenAIConfig({
  veilApiKey: process.env.VEIL_API_KEY,
  upstreamApiKey: process.env.OPENAI_API_KEY,
  inputPolicy: 'block',
  outputPolicy: 'monitor',
}));

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
