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

export async function makeOpenAIRequest(systemPrompt: string, userPrompt: string): Promise<any> {
  try {
    let response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: [
        {role: "system", content: systemPrompt},
        {role: "user", content: userPrompt}
      ],
      max_tokens: 250,
      response_format: { type: "json_object" },
    });
  
    return JSON.parse(response.choices[0].message.content ?? "");
  } catch(error) {
    console.error('Error making API request:', error);
  }
}