// Streaming — tokens arrive in real-time with PII restored.
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://veil-api.com/v1',
  defaultHeaders: {
    'Authorization': `Bearer ${process.env.VEIL_API_KEY}`,
    'x-upstream-key': process.env.OPENAI_API_KEY,
  }
});

const stream = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [{
    role: 'user',
    content: 'Write a formal reply to: I am Tom Ryan (tom@test.com), please help with my billing issue.'
  }],
  stream: true,
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content;
  if (content) process.stdout.write(content);
}
console.log();
