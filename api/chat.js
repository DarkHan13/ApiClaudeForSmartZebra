import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY
});

export default async function handler(req, res)
{
    if (req.method !== "POST")
    {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try
    {
        const { message } = req.body;

        const response =
        await anthropic.messages.create({
            model: "claude-opus-4-6",
            max_tokens: 500,
            messages: [
            {
                role: "user",
                content: message
            }]
        });

        return res.status(200).json({
            answer: response.content[0].text,

            meta: {
            id: response.id,
            model: response.model,
            stop_reason: response.stop_reason,
            input_tokens: response.usage.input_tokens,
            output_tokens: response.usage.output_tokens
            },

        raw: response
        });
    }
    catch(error)
    {
        return res.status(500).json({
            error: error.message
        });
    }
}