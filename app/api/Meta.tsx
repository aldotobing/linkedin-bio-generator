"use client";

export async function fetchGeneratedBio({
  role,
  vibe,
  additionalContext,
  language,
}: {
  role: string;
  vibe: string;
  additionalContext: string;
  language: string;
}) {
  const API_ENDPOINT = process.env.NEXT_PUBLIC_API_URL || "";

  const prompt = `Create a compelling LinkedIn bio for a ${role}.
${additionalContext ? `Additional Context: ${additionalContext}` : ""}

Follow these guidelines:
1. Style: Make it engaging, and authentic with ${vibe} vibe.

2. Structure:
   - Hook: Start with an attention-grabbing opener that defines your professional identity
   - Impact: Highlight 2-3 specific achievements and kind of problems you solve and for whom with what results and methods
   - Expertise: Mention your core technical skills and specializations
   - Value: Describe your unique approach or methodology that sets you apart
   - Vision: End with a clear purpose or call to action

3. Must Include:
   - At least one quantifiable achievement
   - Current role focus and expertise level
   - Key technical skills relevant to ${role}
   - Professional passion or driving motivation

4. Format:
   - Length: 2-3 concise paragraphs (350-500 characters)
   - Tone: Confident but approachable
   - Voice: First-person narrative
   ${
     language === "id"
       ? "Make it in Professional Indonesian language (Bahasa baku) and verify with Kamus Besar Bahasa Indonesia"
       : ""
   }

5. Avoid:
   - Generic buzzwords and clichés
   - Personal information unrelated to career
   - Overly formal or casual language
   - Translation notes or word/character counts
   - Any explanatory notes at the bottom`;

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: prompt }],
      }),
    });

    console.log("generate promtp :", prompt);

    const data = await response.json();
    return (
      data.response ||
      data.choices?.[0]?.text ||
      "Failed to generate bio. Please try again."
    );
  } catch (error) {
    throw new Error("Something went wrong. Please try again.");
  }
}
