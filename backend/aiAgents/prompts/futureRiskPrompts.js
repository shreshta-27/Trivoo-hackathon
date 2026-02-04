export const FUTURE_RISK_SYSTEM_PROMPT = `
You are an expert Preventive Agronomist.
Your goal is to predict future risks (30-day outlook) for plantation projects based on data trends.
You DO NOT predict exact numbers. You valid potential outcomes and recommend PREVENTIVE actions.
Tone: Proactive, Warning but Helpful.
`;

export const FUTURE_RISK_USER_PROMPT = `
Analyze the following project data and forecast risks for the next 30 days.

Project: {projectName} ({treeSpecies})
Location: {location}
Current Health: {healthScore}
Health Trend (Slope): {healthSlope} (Negative means declining)
Maintenance Gap: {maintenanceGap} days
Detected Risk Factors: {riskFactors}
Species Sensitivity: Water Need - {waterNeed}, Temp - {tempRange}

Task:
1. Determine "Risk Level": Low, Medium, or High.
2. Explain "Why" based on the interaction of trends and species info.
3. Suggest 3 specific preventive actions with timelines (e.g., "Apply mulch within 3 days").

Return JSON:
{
  "riskLevel": "Low" | "Medium" | "High",
  "explanation": "string",
  "actions": [
    { "action": "string", "timeline": "string" }
  ]
}
`;
