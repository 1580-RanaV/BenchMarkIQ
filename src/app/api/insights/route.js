import { NextResponse } from "next/server";
import { Groq } from "groq-sdk";
import { InsightPayload } from "../../lib/insightSchema";
import { generateInsights as ruleBased } from "../../utils/insights";

export async function POST(req) {
  const { comparisons, industryName } = await req.json();

  // baseline fallback
  const baseline = ruleBased(comparisons, industryName);

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const system = `
    You are a KPI benchmarking analyst.
    Return ONLY strict JSON with this schema:
    { "insights": [ { "kpi": string, "type": "strength"|"weakness"|"opportunity"|"risk",
      "priority": "high"|"medium"|"low", "impact": "High"|"Medium"|"Low",
      "message": string, "recommendations": string[] } ] }
    No markdown. Compulsory 5 recommendations each section.`;

    const user = JSON.stringify({ industryName, comparisons });

    const resp = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      response_format: { type: "json_object" },
      stream: false,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });

    const raw = resp?.choices?.[0]?.message?.content || "{}";
    const parsed = InsightPayload.parse(JSON.parse(raw));
    return NextResponse.json({ insights: parsed.insights });
  } catch (e) {
    console.error("Groq API failed, falling back:", e);
    return NextResponse.json({ insights: baseline });
  }
}
