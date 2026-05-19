import Anthropic from "@anthropic-ai/sdk";
import fs from "fs/promises";
import path from "path";

const anthropic = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY
});

export default async function handler(req, res)
{
    if(req.method !== "POST")
    {
        return res.status(405).json({
            error:"Method not allowed"
        });
    }

    try
    {
        const data = req.body;

        const promptPath = path.join(
            process.cwd(),
            "prompts",
            process.env.PROMPT_File_NAME
        );

        let prompt =
            await fs.readFile(
                promptPath,
                "utf8"
            );

        const answersText = JSON.stringify(data.answers);

        prompt = prompt
            .replace("{child_name}", data.name)
            .replace("{age}", data.age)
            .replace("{gender}", data.gender)
            .replace("{period}", data.period)
            .replace("{week}", data.weekNumber + " неделя")
            .replace("{totalQuestions}", data.answers.length)
            .replace("lastReport", data.lastReport)
            .replace("{answers}", answersText);

        

        /* return res.status(200).json({
            answer: "Fake answer for testing purposes",
         }); */

        const response =
        await anthropic.messages.create({
            model:"claude-opus-4-6",
            max_tokens:500,
            messages:[
            {
                role:"user",
                content:prompt
            }]
        });

        return res.status(200).json({
            answer:response.content[0].text,

            meta: {
            id: response.id,
            model: response.model,
            stop_reason: response.stop_reason,
            input_tokens: response.usage.input_tokens,
            output_tokens: response.usage.output_tokens
           },
        });
    }
    catch(error)
    {
        console.error(error);

        return res.status(500).json({
            error:error.message
        });
    }
}