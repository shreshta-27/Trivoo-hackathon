import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { Lightbulb, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

const recommendations = [
    {
        title: 'Increase Irrigation in Pune Zone',
        priority: 'High',
        impact: 'Reduce drought stress by 40%',
        description: 'Current rainfall is 30% below average. Implementing additional irrigation systems can mitigate tree stress.',
        action: 'Deploy mobile irrigation units',
    },
    {
        title: 'Fire Prevention Measures - Nashik',
        priority: 'Critical',
        impact: 'Prevent potential forest fires',
        description: 'High fire risk detected due to dry conditions. Immediate action required.',
        action: 'Create firebreaks and deploy monitoring',
    },
    {
        title: 'Wildlife Corridor Expansion',
        priority: 'Medium',
        impact: 'Improve biodiversity by 25%',
        description: 'Analysis shows potential for connecting two forest patches to enhance wildlife movement.',
        action: 'Survey and plan corridor route',
    },
];

export default function RecommendedActions() {
    return (
        <Layout>
            <div className="space-y-6">
                <motion.h1
                    className="text-3xl font-bold text-text-primary"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    AI-Recommended Actions
                </motion.h1>

                <div className="space-y-4">
                    {recommendations.map((rec, index) => (
                        <motion.div
                            key={rec.title}
                            className="card"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-lg ${rec.priority === 'Critical' ? 'bg-accent-red/10' :
                                        rec.priority === 'High' ? 'bg-accent-orange/10' :
                                            'bg-accent-green/10'
                                    }`}>
                                    <Lightbulb className={`w-6 h-6 ${rec.priority === 'Critical' ? 'text-accent-red' :
                                            rec.priority === 'High' ? 'text-accent-orange' :
                                                'text-accent-green'
                                        }`} />
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-xl font-semibold text-text-primary">{rec.title}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${rec.priority === 'Critical' ? 'bg-accent-red/20 text-accent-red' :
                                                rec.priority === 'High' ? 'bg-accent-orange/20 text-accent-orange' :
                                                    'bg-accent-green/20 text-accent-green'
                                            }`}>
                                            {rec.priority}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-accent-green mb-3">
                                        <TrendingUp className="w-4 h-4" />
                                        <span className="text-sm font-medium">{rec.impact}</span>
                                    </div>

                                    <p className="text-text-secondary mb-4">{rec.description}</p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-text-secondary text-sm">
                                            <AlertCircle className="w-4 h-4" />
                                            Recommended: {rec.action}
                                        </div>
                                        <motion.button
                                            className="btn btn-primary"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Implement
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
