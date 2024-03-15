import OpenAI from 'openai';
import axios from 'axios'
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


// Make a request to the OpenAI API
export async function makeRequest() {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/engines/text-davinci-002/completions',
      {
        prompt: 'Translate the following English text to French:',
        max_tokens: 100, // Adjust parameters as needed
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    // Extract the generated text from the response
    const generatedText = response.data.choices[0].text;

    console.log(generatedText);
  } catch (error) {
    console.error('Error making API request:' , error);
  }
}

export async function makeOpenAIRequest(systemPrompt: string, userPrompt: string, prevUserMessages: string[], prevSystemMessages: string[]): Promise<any> {
  let messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [{role: "system", content: systemPrompt}]
  for(let u = 0, s = 0; u < prevUserMessages.length && s < prevSystemMessages.length; u++, s++) {
    messages.push({role: "user", content: prevUserMessages[u]});
    messages.push({role: "assistant", content: prevSystemMessages[s]});
  }
  messages.push({role: "user", content: userPrompt})

  try {
    let response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: messages,
      max_tokens: 250,
      response_format: { type: "json_object" },
    });
  
    return JSON.parse(response.choices[0].message.content ?? "");
  } catch(error) {
    console.error('Error making API request:', error);
    throw new Error("Failed to process question");
  }
}