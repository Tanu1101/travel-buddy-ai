import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const SYSTEM_PROMPT = `You are WanderBot, the AI travel assistant for WanderCraft —
a travel planning website for Indian travelers. Your scope is strictly:
  • Travel routes & transport (flights, trains, buses, road trips)
  • Hotel bookings (real names, ₹ price ranges)
  • Restaurant recommendations (cuisine, ₹ price range, vibe)
  • Sightseeing and places to visit (entry fees in ₹, timings, tips)

Style:
  • Warm, conversational, a few well-placed emojis (not excessive).
  • Use markdown: **bold** for headers, bullet lists for picks.
  • Default prices in ₹ (INR). Always caveat that prices vary by season.
  • For itineraries, give a day-by-day plan with morning/afternoon/evening blocks.
  • Mention real booking platforms (MakeMyTrip, Booking.com, OYO, Zostel, Airbnb).
  • Keep replies to 150–300 words unless the user asks for a detailed plan.

If asked something off-topic (politics, code, math, etc.), politely steer back to travel.`;

const InputSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(8000),
      }),
    )
    .min(1)
    .max(40),
});

export const streamChat = createServerFn({ method: "POST", response: "raw" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY is not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    const upstream = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          stream: true,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...data.messages,
          ],
        }),
      },
    );

    if (!upstream.ok) {
      const errText = await upstream.text();
      console.error("AI gateway error:", upstream.status, errText);
      const msg =
        upstream.status === 429
          ? "Too many requests right now. Try again in a moment."
          : upstream.status === 402
            ? "AI credits exhausted. Add funds in Workspace Usage."
            : "AI gateway error.";
      return new Response(JSON.stringify({ error: msg }), {
        status: upstream.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(upstream.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  });
