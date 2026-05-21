import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const PLANNER_SYSTEM = `You are TripBot, an expert travel planner for Indian travelers.
Generate a complete trip itinerary in clean markdown. Always:
  • Open with a 2-sentence overview of the destination & best season.
  • Provide a Day-by-Day plan (Morning / Afternoon / Evening blocks).
  • Recommend 2-3 real hotels at the user's budget level (with ₹ price ranges).
  • Suggest 3-4 real restaurants (cuisine + ₹ price for two).
  • Add a Transport section (how to get there + getting around).
  • End with a Budget Breakdown table (transport, stay, food, activities) totaling within the user's budget.
  • Caveat that prices vary by season.
Use ## for major sections, ### for days, **bold** sparingly, and bullet lists.
Keep total length under 800 words.`;

const InputSchema = z.object({
  destination: z.string().min(1).max(120),
  origin: z.string().min(1).max(120),
  days: z.number().int().min(1).max(30),
  travelers: z.number().int().min(1).max(20),
  budget: z.enum(["budget", "mid", "luxury"]),
  interests: z.string().max(300).optional(),
});

export const generatePlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
      return new Response(
        JSON.stringify({ error: "GROQ_API_KEY is not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    const budgetLabel = {
      budget: "Backpacker / Budget (₹1,500–₹3,000 per person per day)",
      mid: "Mid-range (₹3,000–₹6,000 per person per day)",
      luxury: "Luxury (₹8,000+ per person per day)",
    }[data.budget];

    const userMsg = `Plan a ${data.days}-day trip to **${data.destination}** from **${data.origin}** for ${data.travelers} traveler(s).
Budget tier: ${budgetLabel}.
Interests: ${data.interests?.trim() || "general sightseeing, local food, and a balanced pace"}.`;

    const upstream = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          stream: true,
          messages: [
            { role: "system", content: PLANNER_SYSTEM },
            { role: "user", content: userMsg },
          ],
        }),
      },
    );

    if (!upstream.ok) {
      const errText = await upstream.text();
      console.error("Groq API error:", upstream.status, errText);
      const msg =
        upstream.status === 429
          ? "Too many requests — try again in a moment."
          : upstream.status === 401
            ? "Invalid Groq API key."
            : "Groq API error.";
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
