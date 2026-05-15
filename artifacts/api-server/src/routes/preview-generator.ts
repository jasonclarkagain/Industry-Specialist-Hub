import { Router } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";
import { GeneratePreviewBody } from "@workspace/api-zod";

const router = Router();

router.post("/", async (req, res) => {
  const parsed = GeneratePreviewBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  const { businessName, businessType, tagline } = parsed.data;

  const prompt = `You are a professional web designer. Generate a landing page concept for a business.

Business Name: ${businessName}
Business Type: ${businessType}
${tagline ? `Tagline hint: ${tagline}` : ""}

Return ONLY valid JSON (no markdown, no code blocks) matching this exact structure:
{
  "headline": "A bold, punchy 5-10 word headline for their hero section",
  "subheadline": "A warm, clear 1-sentence subheadline that explains what they do",
  "description": "A friendly 2-sentence paragraph about the business written in plain English",
  "services": [
    { "title": "Service name", "description": "One sentence description" },
    { "title": "Service name", "description": "One sentence description" },
    { "title": "Service name", "description": "One sentence description" }
  ],
  "callToAction": "Button text, 3-5 words",
  "accentColor": "A CSS hex color that fits the brand personality (e.g. #2563eb for a tech business, #16a34a for a garden center)"
}

Make the content feel authentic, warm, and specific to this type of business. No generic filler.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-5-mini",
    max_completion_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = completion.choices[0]?.message?.content ?? "";

  let result;
  try {
    result = JSON.parse(raw.trim());
  } catch {
    req.log.error({ raw }, "Failed to parse AI response as JSON");
    res.status(500).json({ error: "Failed to generate preview" });
    return;
  }

  req.log.info({ businessName, businessType }, "Preview generated");
  res.json(result);
});

export default router;
