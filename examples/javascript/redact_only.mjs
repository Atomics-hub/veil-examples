// Redact-only example using the official Veil JS package.
import { VeilClient } from 'a5omic-veil';

const veil = new VeilClient({
  apiKey: process.env.VEIL_API_KEY,
});

const result = await veil.redact({
  text: 'admit date: 03/15/2024, patient age: 92, MRN: AB123456',
  compliance: 'hipaa',
});

console.log(result);
