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
            answer: response.content[0].text
        });
    }
    catch(error)
    {
        return res.status(500).json({
            error: error.message
        });
    }
}