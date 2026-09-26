import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

import {
  posterRequestSchema,
  posterResponseSchema,
  type PosterRequest,
  type PosterResponse,
} from "./poster-schema";

let ai: GoogleGenAI | undefined;

function getGoogleGenAI() {
  if (ai) {
    return ai;
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  ai = new GoogleGenAI({ apiKey });
  return ai;
}

const unsupportedGeminiSchemaKeywords = new Set([
  "$schema",
  "minLength",
  "maxLength",
]);

function toGeminiJsonSchema(schema: unknown): unknown {
  if (Array.isArray(schema)) {
    return schema.map(toGeminiJsonSchema);
  }

  if (schema && typeof schema === "object") {
    return Object.fromEntries(
      Object.entries(schema)
        .filter(([key]) => !unsupportedGeminiSchemaKeywords.has(key))
        .map(([key, value]) => [key, toGeminiJsonSchema(value)])
    );
  }

  return schema;
}

const posterJsonSchema = toGeminiJsonSchema(
  z.toJSONSchema(posterResponseSchema)
);

export async function generatePosterContent(
  input: PosterRequest
): Promise<PosterResponse> {
  const validatedInput =
    posterRequestSchema.parse(input);

  const prompt = `
You are the content-generation assistant inside
a political poster design application.

Create concise poster copy and layout recommendations
using ONLY the information supplied by the user.

Rules:

- Preserve the supplied person's name exactly.
- Preserve organization/party exactly.
- Preserve designation exactly.
- Preserve occasion exactly.
- Preserve the supplied headline exactly when one is provided.
- Preserve date and location.
- Do not invent achievements.
- Do not invent endorsements.
- Do not invent election results.
- Do not invent policy promises.
- Do not create accusations or attacks.
- Do not create targeted voter persuasion.
- Improve the user's supplied message only for clarity.
- Keep the poster text short and readable.
- Return content in the requested language.
- The selected style is a visual preference.
- Return ONLY valid JSON.

Poster information:

Name:
${validatedInput.name}

Designation:
${validatedInput.designation || "Not provided"}

Organization / Party:
${validatedInput.organization || "Not provided"}

Occasion:
${validatedInput.occasion}

Requested Headline:
${validatedInput.headline || "Create a concise headline for this occasion"}

Date:
${validatedInput.date || "Not provided"}

Location:
${validatedInput.location || "Not provided"}

User Message:
${validatedInput.message || "Not provided"}

Visual Style:
${validatedInput.style}

Selected Template:
${validatedInput.templateName || "General political poster"}

Language:
${validatedInput.language}
`;

  const response = await getGoogleGenAI().models.generateContent({
    model: "gemini-3.8-flash",

    contents: prompt,

    config: {
      temperature: 0.7,

      responseMimeType:
        "application/json",

      responseJsonSchema:
        posterJsonSchema,
    },
  });

  if (!response.text) {
    throw new Error(
      "Gemini returned an empty response."
    );
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(response.text);
  } catch {
    throw new Error(
      "Gemini returned invalid JSON."
    );
  }

  return posterResponseSchema.parse(parsed);
}