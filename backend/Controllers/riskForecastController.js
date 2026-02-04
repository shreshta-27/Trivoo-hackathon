import Project from '../Models/Project.js';
import TreeSpecies from '../Models/TreeSpecies.js';
import AlertLog from '../Models/AlertLog.js';
import { analyzeTrends } from '../services/trendAnalysisService.js';
import { forecastFutureRisk } from '../aiAgents/futureRiskAgent.js';
import { sendAlertEmail } from '../utils/emailService.js';

export const runRiskForecastJob = async () => {
    console.log('🔮 Starting Future Risk Forecast Job...');
    try {
        // 1. Fetch Active Projects (not analyzed in last 7 days ideally, but for now all)
        const projects = await Project.find({ status: 'active' }).populate('manager');

        for (const project of projects) {
            // Check throttle (skip if analyzed < 7 days ago)
            if (project.lastRiskAnalysis) {
                const daysSince = (new Date() - new Date(project.lastRiskAnalysis)) / (1000 * 60 * 60 * 24);
                if (daysSince < 7) continue;
            }

            // 2. Trend Analysis
            // Need species data
            const species = await TreeSpecies.findOne({ name: project.treeType }) || {
                water_need: 'Medium', temperature_c: '20-30', maintenance: 'Medium'
            };

            const trends = analyzeTrends(project, species);

            // 3. AI Forecast
            const forecast = await forecastFutureRisk(project, trends, species);

            // 4. Alerting
            if (['Medium', 'High'].includes(forecast.riskLevel)) {

                // Format Email
                const subject = `Preventive Alert: ${forecast.riskLevel} Risk Detected for ${project.name}`;
                const body = `
                    <h2>Future Risk Forecast (30-Day Outlook)</h2>
                    <p><strong>Project:</strong> ${project.name}</p>
                    <p><strong>Detected Trends:</strong> ${trends.riskFactors.join(', ') || 'Minor fluctuations'}</p>
                    <hr/>
                    <h3>⚠️ Expected Outcome: ${forecast.riskLevel} Risk</h3>
                    <p>${forecast.explanation}</p>
                    <h3>🛡️ Preventive Actions:</h3>
                    <ul>
                        ${forecast.actions.map(a => `<li><strong>${a.action}</strong> (Time: ${a.timeline})</li>`).join('')}
                    </ul>
                    <p style="font-size:0.8em; color:gray;">*This is an AI-assisted early warning system, not a guaranteed prediction.*</p>
                `;

                if (project.manager && project.manager.email) {
                    await sendAlertEmail(project.manager.email, subject, body);
                    console.log(`📧 Sent forecast email to ${project.manager.email}`);
                }

                // Log
                await AlertLog.create({
                    project: project._id,
                    user: project.manager._id || project.manager,
                    riskType: 'future_forecast_risk',
                    severity: forecast.riskLevel.toLowerCase(),
                    emailContent: { subject, body },
                    status: 'sent',
                    metadata: { aiReasoning: forecast.explanation }
                });
            }

            // Update timestamp
            project.lastRiskAnalysis = new Date();
            await project.save();
        }
        console.log('🔮 Forecast Job Completed.');

    } catch (error) {
        console.error('Forecast Job Error:', error);
    }
};

export const manualTriggerForecast = async (req, res) => {
    try {
        await runRiskForecastJob();
        res.json({ success: true, message: 'Forecast job triggered manually.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
