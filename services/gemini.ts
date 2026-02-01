import { GoogleGenAI } from "@google/genai";
import { Transaction, Account } from "../types";
import { formatCurrency } from "../constants";

// Initialize Gemini Client
const apiKey = process.env.API_KEY || ''; // Ideally handled via secure proxy or input in production
const ai = new GoogleGenAI({ apiKey });

export const generateFinancialInsights = async (
  transactions: Transaction[], 
  accounts: Account[]
): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please configure the environment to use AI features.";
  }

  // Filter last 30 days for relevance
  const now = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);
  
  const recentTransactions = transactions.filter(t => new Date(t.date) >= thirtyDaysAgo);

  const summary = recentTransactions.map(t => 
    `${t.date}: ${t.type} of ${formatCurrency(t.amount)} for ${t.category} (${t.description})`
  ).join('\n');

  const prompt = `
    You are a financial advisor for the app CREDFIN. 
    Analyze the following recent transactions (last 30 days) and provide 3 brief, actionable insights or savings tips.
    Be concise, friendly, and professional. Focus on spending habits.
    
    Data:
    ${summary || "No recent transactions found."}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Could not generate insights at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I couldn't analyze your data right now. Please check your connection or API key.";
  }
};