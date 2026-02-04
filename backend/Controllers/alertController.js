import AlertLog from '../Models/AlertLog.js';
import User from '../Models/userSchema.js'; // Assuming User model path
import { sendAlertEmail } from '../utils/emailService.js';
import { generateAlertContent } from '../aiAgents/alertGeneratorAgent.js';

/**
 * Main function to trigger an alert.
 * @param {Object} triggerData - Context for the alert
 * REQUIRED FIELDS:
 * - userId: string
 * - projectId: string
 * - riskType: 'health_critical' | 'action_urgent' | 'incident_high_risk'
 * - severity: 'high' | 'critical'
 * - projectName: string
 * - location: string
 * - issueDescription: string
 * - actionRecommendation: string
 */
export const triggerAlert = async (triggerData) => {
    try {
        const { userId, projectId, riskType, severity } = triggerData;

        // 1. Validate Severity (Avoid spamming low priority)
        if (!['high', 'critical'].includes(severity)) {
            console.log(`ℹ️ Alert skipped: Severity '${severity}' is below threshold.`);
            return { success: false, reason: 'low_severity' };
        }

        // 2. Idempotency Check (Don't spam user for same issue today)
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const existingAlert = await AlertLog.findOne({
            project: projectId,
            riskType: riskType,
            sentAt: { $gte: twentyFourHoursAgo }
        });

        if (existingAlert) {
            console.log(`ℹ️ Alert skipped: Already sent notification for ${riskType} in last 24h.`);
            return { success: false, reason: 'already_sent' };
        }

        // 3. Fetch User (to get email)
        const user = await User.findById(userId);
        if (!user || !user.email) {
            console.error(`❌ Alert failed: User ${userId} not found or no email.`);
            return { success: false, reason: 'user_not_found' };
        }

        // 4. Generate AI Content
        const aiContent = await generateAlertContent({
            ...triggerData,
            urgencyLevel: severity === 'critical' ? 'Immediate' : 'High'
        });

        // 5. Send Email
        const emailResult = await sendAlertEmail(user.email, aiContent.subject, aiContent.htmlBody);

        // 6. Log to DB
        await AlertLog.create({
            project: projectId,
            user: userId,
            riskType: riskType,
            severity: severity,
            emailContent: {
                subject: aiContent.subject,
                body: aiContent.htmlBody
            },
            status: emailResult.success ? 'sent' : 'failed',
            metadata: {
                aiReasoning: triggerData.issueDescription // Simplified metadata
            }
        });

        return { success: true, messageId: emailResult.messageId };

    } catch (error) {
        console.error('SERVER ERROR triggering alert:', error);
        return { success: false, error: error.message };
    }
};

export default { triggerAlert };
