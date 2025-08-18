// src/lib/getInsights.js
import { Groq } from "groq-sdk";
import { InsightPayload } from "./insightSchema.js";
import { generateInsights as ruleBased } from "../utils/insights.js";

// Initialize Groq client with error handling
let groq = null;
try {
  if (process.env.GROQ_API_KEY) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    console.log('✅ Groq client initialized successfully');
  } else {
    console.warn('⚠️  GROQ_API_KEY not found, falling back to rule-based insights');
  }
} catch (error) {
  console.warn('❌ Failed to initialize Groq client:', error.message);
}

export async function getInsights({ comparisons, industryName }) {
  console.log('🔍 getInsights called with:', { 
    industryName, 
    comparisonsCount: comparisons?.length,
    hasGroqClient: !!groq 
  });

  // deterministic baseline
  const baseline = ruleBased(comparisons, industryName);
  console.log('📊 Rule-based baseline generated:', baseline?.length, 'insights');

  // If Groq client isn't available, return baseline immediately
  if (!groq) {
    console.log('🔄 Groq client not available, using rule-based insights');
    return baseline;
  }

  const system = `
You are a KPI benchmarking analyst. You need to give detailed and very useful info.
Return ONLY strict JSON with this schema:
{ "insights": [ { "kpi": string, "type": "strength"|"weakness"|"opportunity"|"risk",
  "priority": "high"|"medium"|"low", "impact": "High"|"Medium"|"Low",
  "message": string, "recommendations": string[] } ] }
Use concise, business-safe wording. Compulsory 5 recommendations each. No markdown.`;

  const user = JSON.stringify({ industryName, comparisons });

  try {
    console.log('🤖 Starting AI insight generation...');
    console.time('AI Response Time');

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

    console.timeEnd('AI Response Time');
    console.log('✨ AI response received successfully');

    const raw = resp?.choices?.[0]?.message?.content || "{}";
    console.log('📝 Raw AI response length:', raw.length, 'characters');

    const parsed = InsightPayload.parse(JSON.parse(raw));
    console.log('✅ AI insights parsed successfully:', parsed.insights?.length, 'insights');
    console.log('📋 First insight preview:', parsed.insights?.[0]);
    
    return parsed.insights;
  } catch (e) {
    console.error("❌ Groq/Llama failed, using fallback:", e.message);
    console.log('🔄 Falling back to rule-based insights');
    return baseline;
  }
}