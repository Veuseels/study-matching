import OpenAI from 'openai';

export const getOpenAIClient = (): OpenAI | null => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    if (!apiKey) {
        console.warn('OpenAI API key not found in environment variables');
        return null;
    }

    return new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true // Required for client-side usage
    });
};

export const sendMessageToAI = async (
    messages: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> => {
    const client = getOpenAIClient();

    if (!client) {
        throw new Error('OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your .env.local file.');
    }

    try {
        const completion = await client.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: `You are a helpful AI study assistant for students. Your role is to:
- Help students understand complex academic concepts
- Explain topics in clear, simple language
- Provide study tips and learning strategies
- Answer questions about various subjects
- Encourage critical thinking
- Be supportive and encouraging

Keep responses concise but informative. Use examples when helpful.`
                },
                ...messages
            ],
            temperature: 0.7,
            max_tokens: 500
        });

        return completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    } catch (error) {
        console.error('OpenAI API error:', error);
        if (error instanceof Error) {
            throw new Error(`AI Assistant error: ${error.message}`);
        }
        throw new Error('Failed to get response from AI assistant');
    }
};
