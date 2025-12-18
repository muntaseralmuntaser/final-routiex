
import { GoogleGenAI, Type } from "@google/genai";
import { MarketSignal, TradeHistory, Timeframe, AiSignalResponse, TradingStrategy } from "../types";

// Initialize Gemini Client
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export interface NewsAnalysisResult {
    sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
    dxyImpact: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
    summary: string;
    reasoning: string;
    prediction: 'Bullish Breakout' | 'Bearish Breakdown' | 'Range/Neutral' | 'Volatility Spike';
    confidenceScore: number; // 0 to 100
}

export const analyzeNewsImpact = async (headline: string, symbol: string): Promise<NewsAnalysisResult | null> => {
    if (!apiKey) return null;

    try {
        const prompt = `
        Act as a Wall Street Quant Analyst. Analyze this financial news headline: "${headline}" related to ${symbol}.

        Determine:
        1. The sentiment for the specific asset (${symbol}).
        2. The likely impact on the US DOLLAR INDEX (DXY).
        3. A brief professional reasoning.
        4. A specific short-term market prediction (e.g., Bullish Breakout).
        5. A confidence score (0-100) based on the clarity of the news.

        Output JSON only.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-exp',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        sentiment: { type: Type.STRING },
                        dxyImpact: { type: Type.STRING },
                        summary: { type: Type.STRING },
                        reasoning: { type: Type.STRING },
                        prediction: { type: Type.STRING },
                        confidenceScore: { type: Type.NUMBER }
                    }
                }
            }
        });

        if (response.text) {
            return JSON.parse(response.text) as NewsAnalysisResult;
        }
        return null;
    } catch (error) {
        console.error("News Analysis Error", error);
        return null;
    }
};

export const generateRoutiexSignal = async (symbol: string, price: number, timeframe: string, strategy: string, customScript?: string): Promise<AiSignalResponse | null> => {
    if (!apiKey) return null;

    try {
        const prompt = `
        You are "Routiex AI", an elite Institutional Quantitative System.
        
        TASK: Generate a professional analysis and trade signal for ${symbol} using these STRICT rules:
        
        1. DATA SOURCES: 
           - Use Google Search to get LIVE current price, high/low for 5m, 15m, 30m, 1h, 4h, and 1D.
           - Get LIVE Stochastic (14,4,4) and RSI values for 15m, 30m, and 1h.
        
        2. TECHNICAL TRIGGERS:
           - SELL SIGNAL: Generate a STRONG SELL if Stochastic (14,4,4) AND RSI are ABOVE 90 (Overbought threshold) on 15m, 30m, or 1h.
           - BUY SIGNAL: Generate a STRONG BUY if Stochastic (14,4,4) AND RSI are BELOW 10 (Oversold threshold) on 15m, 30m, or 1h.
        
        3. MULTI-TF FIBONACCI:
           - Analyze Fibonacci retracement levels from the Daily, 4-Hour, and 1-Hour charts to find key confluence zones.
        
        4. CHART PATTERNS:
           - Identify Double Bottom, Head and Shoulders, or SMC (Smart Money Concepts) order blocks.
           - Use Supertrend as the primary trend filter.
        
        5. OUTPUT:
           - Construct a trade setup including Entry Zone, 3 Take Profits (TP1, TP2, TP3), and Stop Loss.
           - The reasoning MUST mention the specific Stochastic/RSI values and Fibonacci levels found.

        IMPORTANT: Return ONLY a raw JSON object:
        {
            "symbol": "${symbol}",
            "action": "BUY" | "SELL",
            "confidence": (number 0-100),
            "entryZone": "string",
            "tp1": "string",
            "tp2": "string",
            "tp3": "string",
            "stopLoss": "string",
            "reasoning": "Mention specific levels/indicators",
            "timeframe": "${timeframe}"
        }
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-exp',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }]
            }
        });

        if (response.text) {
            let cleanText = response.text.trim();
            if (cleanText.startsWith('```json')) cleanText = cleanText.replace(/^```json/, '').replace(/```$/, '');
            return JSON.parse(cleanText) as AiSignalResponse;
        }
        return null;
    } catch (error) {
        console.error("Routiex AI Signal Error:", error);
        return null;
    }
};

export const generateTradeFeedback = async (trades: TradeHistory[]): Promise<string> => {
  if (!apiKey) return "API Key Missing.";
  const recentTrades = trades.slice(0, 5).map(t => `${t.type} ${t.symbol} @ ${t.openPrice}`).join('\n');
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-exp",
    contents: `Review these trades and give institutional risk feedback: ${recentTrades}`,
  });
  return response.text || "No feedback.";
};
