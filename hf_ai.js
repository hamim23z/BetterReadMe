import { InferenceClient } from "@huggingface/inference";
import fs from "fs";
import "dotenv/config";

const token = process.env.HF_TOKEN;
if (!token) throw new Error("HF_TOKEN is not set in your .env file");
const client = new InferenceClient(process.env.HF_TOKEN);

export async function generateReadMe(answers, projectType, files) {
  const { title, sections } = answers;

  const prompt = `
Generate a professional README.md for a project with the following details:

Title: ${title}
Project type: ${projectType}
Sections to include: ${sections.join(", ")}
Project files: ${files.join(", ")}

Make it clear, concise, and professional. Output in Markdown format.
`;

  try {
    const completion = await client.chatCompletion({
      model: "openai/gpt-oss-120b:fastest",
      messages: [{ role: "user", content: prompt }],
    });

    const readmeContent = completion.choices[0].message.content;
    fs.writeFileSync("README.md", readmeContent);
    console.log("✅ README.md generated successfully!");
  } catch (err) {
    console.error("❌ Error generating README:", err);
  }
}
