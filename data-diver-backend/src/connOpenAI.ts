import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Set your API key
const apiKey = process.env.OPENAI_API_KEY;

// Define your prompt or input text
const prompt = 'Translate the following English text to French:';

// Make a request to the OpenAI API
async function makeRequest() {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/engines/text-davinci-002/completions',
      {
        prompt: prompt,
        max_tokens: 100, // Adjust parameters as needed
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
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

// Call the function to make the API request
//makeRequest();
export default makeRequest