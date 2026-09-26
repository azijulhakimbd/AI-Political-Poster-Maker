import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import {
  posterRequestSchema,
} from "@/lib/poster-schema";

import {
  generatePosterContent,
} from "@/lib/gemini";

import { authConfig } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const generationWindows = new Map<string, { count: number; resetAt: number }>();
const MAX_GENERATIONS_PER_WINDOW = 10;
const GENERATION_WINDOW_MS = 10 * 60 * 1000;

function consumeGenerationSlot(userId: string) {
  const now = Date.now();
  const window = generationWindows.get(userId);

  if (!window || window.resetAt <= now) {
    generationWindows.set(userId, {
      count: 1,
      resetAt: now + GENERATION_WINDOW_MS,
    });
    return true;
  }

  if (window.count >= MAX_GENERATIONS_PER_WINDOW) return false;
  window.count += 1;
  return true;
}

export async function POST(
  request: Request
) {
  const session = await getServerSession(authConfig);

  if (!session?.user?.id || !session.accessToken) {
    return NextResponse.json(
      { success: false, error: "Please sign in to generate a poster." },
      { status: 401 }
    );
  }

  let posterId: string | undefined;

  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid poster data." },
        { status: 400 }
      );
    }
    posterId = typeof body.posterId === "string" ? body.posterId : undefined;

    const parsed =
      posterRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid poster data.",
          details: parsed.error.flatten(),
        },
        {
          status: 400,
        }
      );
    }

    if (!consumeGenerationSlot(session.user.id)) {
      return NextResponse.json(
        { success: false, error: "Generation limit reached. Try again in 10 minutes." },
        { status: 429 }
      );
    }

    if (posterId) {
      const reservation = await fetch(
        `${API_URL}/api/posters/${encodeURIComponent(posterId)}/regenerate`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${session.accessToken}` },
          cache: "no-store",
        }
      );

      if (!reservation.ok) {
        const errorData = await reservation.json().catch(() => null);
        return NextResponse.json(
          {
            success: false,
            error: errorData?.message || "Unable to regenerate this poster.",
          },
          { status: reservation.status }
        );
      }
    }

    const data =
      await generatePosterContent(parsed.data);

    if (posterId) {
      await fetch(`${API_URL}/api/posters/${encodeURIComponent(posterId)}/generation-result`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "completed", aiContent: data }),
        cache: "no-store",
      });
    }

    return NextResponse.json(
      {
        success: true,
        data,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "Gemini poster generation error:",
      error
    );

    if (posterId) {
      await fetch(`${API_URL}/api/posters/${encodeURIComponent(posterId)}/generation-result`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "failed" }),
        cache: "no-store",
      }).catch(() => undefined);
    }

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate poster content.",
      },
      {
        status: 500,
      }
    );
  }
}