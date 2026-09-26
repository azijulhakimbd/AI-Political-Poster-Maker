import { z } from "zod";

export const posterRequestSchema = z.object({
  name: z.string().trim().min(1).max(100),
  designation: z.string().trim().max(150).default(""),
  organization: z.string().trim().max(200).default(""),
  occasion: z.string().trim().min(1).max(100),
  headline: z.string().trim().max(200).default(""),
  date: z.string().max(30).default(""),
  location: z.string().trim().max(200).default(""),
  message: z.string().trim().max(500).default(""),
  templateName: z.string().trim().max(120).default(""),
  style: z.enum(["classic", "modern", "premium"]).default("classic"),
  language: z.enum(["bn", "en"]).default("bn"),
});

export const posterResponseSchema = z.object({
  headline: z.string().min(1).max(200),
  subheadline: z.string().max(300),
  message: z.string().max(700),
  name: z.string().max(100),
  designation: z.string().max(150),
  organization: z.string().max(200),
  date: z.string().max(30),
  location: z.string().max(200),
  footer: z.string().max(300),

  theme: z.enum([
    "green",
    "red",
    "blue",
    "gold",
    "dark",
    "minimal",
  ]),

  layout: z.enum([
    "portrait",
    "square",
    "landscape",
  ]),

  textAlignment: z.enum([
    "left",
    "center",
    "right",
  ]),

  headlineStyle: z.enum([
    "bold",
    "elegant",
    "modern",
    "traditional",
  ]),

  suggestedSlogan: z.string().max(200),
});

export type PosterRequest = z.infer<typeof posterRequestSchema>;
export type PosterResponse = z.infer<typeof posterResponseSchema>;