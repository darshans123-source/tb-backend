import { GoogleGenAI } from "@google/genai";
import { config } from "../config/env.js";

class AIService {
  private ai: GoogleGenAI | null = null;

  constructor() {
    if (config.geminiApiKey) {
      this.ai = new GoogleGenAI({ apiKey: config.geminiApiKey });
    }
  }

  public isConfigured(): boolean {
    return !!this.ai;
  }

  public async generateContent(prompt: string, context?: string): Promise<{ reply: string; source: string }> {
    if (!this.ai) {
      let reply = "Based on national NTEP guidelines, presumptive pulmonary TB requires rapid molecular testing (CBNAAT) and sputum smear microscopy. If smear is negative but CXR or clinical suspicion is high, CBNAAT confirmation is mandatory.";
      const lowerPrompt = prompt.toLowerCase();
      if (lowerPrompt.includes('pediatric')) {
        reply = "In pediatric TB (Page 22 algorithm), if molecular testing is negative or unavailable, evaluate access for CXR and Mantoux TST. Calculate the TB Score: a score ≥ 6 indicates active TB and warrants anti-TB treatment.";
      } else if (lowerPrompt.includes('mdr') || lowerPrompt.includes('rifampicin')) {
        reply = "Rifampicin resistance detected on CBNAAT mandates immediate referral to PMDT (Programmatic Management of Drug Resistant TB) for second-line Line Probe Assay (LPA) and an all-oral Bedaquiline-containing regimen.";
      } else if (lowerPrompt.includes('hiv')) {
        reply = "For PLHIV presenting with TB symptoms, CBNAAT is the primary diagnostic test. Cotrimoxazole Preventive Therapy (CPT) and Anti-TB treatment should be initiated immediately, followed by ART within 2 to 4 weeks.";
      }
      return { reply, source: 'fallback' };
    }

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `You are the TB Quest AI Clinical Tutor for Skill Development Center, NIT Raichur. You are an expert in Tuberculosis diagnostic algorithms (NTEP & WHO guidelines), CBNAAT interpretation, pediatric TB score calculation, and MDR-TB management. Provide clear, supportive, concise medical educational advice to medical undergraduate students.\n\nUser Question: ${prompt}\nContext: ${context || 'General TB Clinical Enquiry'}`
              }
            ]
          }
        ]
      });

      const reply = response.text || "Thank you for asking. According to NTEP standards, early molecular diagnosis with CBNAAT is crucial for ruling out drug-resistant tuberculosis.";
      return { reply, source: 'gemini' };
    } catch (err) {
      console.error("Gemini API error:", err);
      return {
        reply: "Based on national TB guidelines, presumptive pulmonary TB requires sputum examination or CBNAAT testing. If smear is negative but clinical suspicion remains high, CBNAAT is mandatory.",
        source: 'fallback-error'
      };
    }
  }
}

export const aiService = new AIService();
