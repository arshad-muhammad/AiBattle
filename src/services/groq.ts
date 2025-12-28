import Groq from 'groq-sdk';

// Initialize the client
const getClient = () => {
    const apiKey = process.env.GROQ_API_KEY || ''; 
    if (!apiKey) {
        console.warn('GROQ API Key is missing');
    }
    return new Groq({ apiKey, dangerouslyAllowBrowser: true });
};

// We will use one powerful model from Groq (e.g. Llama 3 or Mixtral) to simulate all others
// or we can mix and match real Groq models if they align.
const BASE_MODEL = 'llama-3.3-70b-versatile'; // Updated to latest supported Groq model

// The list of models we want to PRETEND we are querying.
// We will modify the system prompt slightly to make them act in character if needed,
// or just use the base model to generate diverse answers.
export const BATTLE_MODELS = [
    { id: 'Qwen/Qwen3-0.6B', displayName: 'Qwen 3', systemInstruction: 'You are Qwen 3, a highly efficient small language model. Be concise and direct.' },
    { id: 'openai/gpt-oss-20b', displayName: 'OPENAI GPT', systemInstruction: 'You are GPT-OSS, a powerful open source model. Provide detailed and structured answers.' },
    { id: 'google/gemma-3-1b-it', displayName: 'Gemma 3', systemInstruction: 'You are Gemma 3, a compact model from Google. Be helpful and safety-conscious.' },
    { id: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B', displayName: 'DeepSeek R1', systemInstruction: 'You are DeepSeek R1. Focus on reasoning and technical depth.' },
    { id: 'meta-llama/Llama-2-7b-chat-hf', displayName: 'Llama 2', systemInstruction: 'You are Llama 2. Be conversational and friendly.' },
    { id: 'mistralai/Mistral-7B-Instruct-v0.3', displayName: 'Claude', systemInstruction: 'You are a Mistral model fine-tuned with Claude data. Be articulate and nuanced.' },
];

export const runGroqModel = async (simulatedModelId: string, prompt: string) => {
    const client = getClient();
    
    // Find the "persona" instructions
    const modelConfig = BATTLE_MODELS.find(m => m.id === simulatedModelId);
    const systemContent = modelConfig?.systemInstruction || 'You are a helpful AI assistant.';

    try {
        const completion = await client.chat.completions.create({
            messages: [
                { role: 'system', content: systemContent },
                { role: 'user', content: prompt }
            ],
            model: BASE_MODEL,
            temperature: 0.7, // Add some randomness so they don't all look identical
            max_tokens: 1024,
        });

        return { text: completion.choices[0]?.message?.content || '' };
    } catch (e: any) {
        console.error(`Exception calling Groq for ${simulatedModelId}:`, e);
        return { error: e.message || "Failed to fetch response" };
    }
};

