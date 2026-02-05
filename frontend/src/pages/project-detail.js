import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import { projects, recommendations } from '../utils/api';
import {
    ArrowLeft,
    MapPin,
    TreePine,
    Calendar,
    TrendingUp,
    AlertTriangle,
    Activity,
    Lightbulb,
    Sparkles,
} from 'lucide-react';

export default function ProjectDetail() {
    const router = useRouter();
    const { id } = router.query;
    const [project, setProject] = useState(null);
    const [statistics, setStatistics] = useState(null);
    const [activeRecommendations, setActiveRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchProjectDetails();
        }
    }, [id]);

    const fetchProjectDetails = async () => {
        try {
            setLoading(true);
            const [projRes, statsRes, recRes] = await Promise.all([
                projects.getById(id),
                projects.getStatistics(id).catch(e => ({ data: { data: null } })), // Fail gracefully
                recommendations.getActive(id).catch(e => ({ data: { data: [] } }))
            ]);

            if (projRes.data?.data) {
                setProject(projRes.data.data);
            }
            if (statsRes.data?.data) {
                setStatistics(statsRes.data.data);
            }
            if (recRes.data?.data) {
                setActiveRecommendations(recRes.data.data);
            }
        } catch (error) {
            console.error("Error fetching project details", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getHealthColor = (score) => {
        if (score >= 80) return '#10b981';
        if (score >= 50) return '#f59e0b';
        return '#ef4444';
    };

    const getSeverityColor = (severity) => {
        switch (severity?.toLowerCase()) {
            case 'critical':
            case 'high': return '#ef4444';
            case 'medium': return '#f59e0b';
            case 'low': return '#3b82f6';
            default: return '#6b7280';
        }
    };

    if (loading) {
        return (
            <DashboardLayout activePage="my-projects">
                <div className="flex justify-center items-center min-h-[60vh]">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        style={{ borderTopColor: 'transparent' }}
                        className="w-12 h-12 border-4 border-emerald-500 rounded-full"
                    />
                </div>
            </DashboardLayout>
        );
    }

    if (!project) {
        return (
            <DashboardLayout activePage="my-projects">
                <div className="text-center py-20">
                    <h2 className="text-2xl font-bold text-white mb-4">Project Not Found</h2>
                    <motion.button
                        onClick={() => router.push('/my-projects')}
                        className="px-6 py-2 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors"
                    >
                        Back to Projects
                    </motion.button>
                </div>
            </DashboardLayout>
        );
    }

    // Mock timeline if no stats available yet, or use statistics
    const healthTimeline = statistics?.healthTrends || [
        { date: 'Initial', score: 100 },
        { date: 'Current', score: project.healthScore }
    ];

    const risks = project.activeRisks || [];

    return (
        <DashboardLayout activePage="my-projects">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <motion.button
                    onClick={() => router.push('/my-projects')}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-gray-300 font-semibold mb-8 hover:bg-white/15 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Projects
                </motion.button>

                {/* Project Header */}
                <motion.div
                    className="glass-card p-8 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                {project.name}
                            </h1>
                            <p className="text-lg text-gray-400 max-w-2xl">{project.description || 'No description provided.'}</p>
                        </div>
                        <div className="flex items-center gap-4 px-6 py-4 rounded-xl border-2"
                            style={{
                                borderColor: getHealthColor(project.healthScore),
                                backgroundColor: `${getHealthColor(project.healthScore)}10`
                            }}>
                            <Activity className="w-8 h-8" style={{ color: getHealthColor(project.healthScore) }} />
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: getHealthColor(project.healthScore) }}>
                                    Health Score
                                </p>
                                <p className="text-3xl font-bold leading-none" style={{ color: getHealthColor(project.healthScore) }}>
                                    {project.healthScore}%
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-white/10">
                        <div className="flex items-center gap-3">
                            <MapPin className="w-6 h-6 text-emerald-500" />
                            <div>
                                <p className="text-xs text-gray-400">Region</p>
                                <p className="text-lg font-semibold text-white">
                                    {project.region?.name || 'Unknown'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <TreePine className="w-6 h-6 text-emerald-500" />
                            <div>
                                <p className="text-xs text-gray-400">Trees Planted</p>
                                <p className="text-lg font-semibold text-white">
                                    {(project.plantationSize || project.metadata?.initialTrees || 0).toLocaleString()}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar className="w-6 h-6 text-emerald-500" />
                            <div>
                                <p className="text-xs text-gray-400">Started</p>
                                <p className="text-lg font-semibold text-white">
                                    {formatDate(project.createdAt || project.metadata?.plantationDate)}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Health Timeline */}
                <motion.div
                    className="glass-card p-8 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-emerald-500" />
                        Health Score Timeline
                    </h2>
                    <div className="flex items-end gap-3 h-48">
                        {healthTimeline.map((point, index) => {
                            const score = typeof point === 'object' ? point.score || point.healthScore : point;
                            // normalize safe score
                            const safeScore = score || 0;
                            const dateLabel = point.date ? formatDate(point.date) : `Point ${index + 1}`;

                            return (
                                <motion.div
                                    key={index}
                                    className="flex-1 flex flex-col items-center gap-2 group"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: '100%', opacity: 1 }}
                                    transition={{ delay: 0.3 + index * 0.05 }}
                                >
                                    <div className="flex-1 w-full flex items-end justify-center relative">
                                        <div
                                            className="w-full max-w-[60px] rounded-t-lg transition-all duration-300 relative group-hover:brightness-110"
                                            style={{
                                                height: `${safeScore}%`,
                                                background: 'linear-gradient(180deg, var(--emerald-green), var(--bright-green))'
                                            }}
                                        >
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                                {safeScore}%
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-500 truncate w-full text-center">
                                        {dateLabel}
                                    </span>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Active Risks */}
                    <motion.div
                        className="glass-card p-8"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <AlertTriangle className="w-6 h-6 text-amber-500" />
                            Active Risks
                        </h2>
                        <div className="space-y-4">
                            {risks.length === 0 ? (
                                <p className="text-gray-400 italic">No active risks detected.</p>
                            ) : (
                                risks.map((risk, idx) => (
                                    <motion.div
                                        key={idx}
                                        className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                                        style={{ borderColor: `${getSeverityColor(risk.severity)}40` }}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-semibold text-white">
                                                {risk.type || risk.title}
                                            </h3>
                                            <span
                                                className="px-3 py-1 rounded-md text-xs font-bold uppercase"
                                                style={{
                                                    background: `${getSeverityColor(risk.severity)}20`,
                                                    color: getSeverityColor(risk.severity),
                                                }}
                                            >
                                                {risk.severity}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-400 mb-1">
                                            {risk.description}
                                        </p>
                                        {risk.date && (
                                            <p className="text-xs text-gray-500">
                                                Detected: {formatDate(risk.date)}
                                            </p>
                                        )}
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>

                    {/* Recommended Actions */}
                    <motion.div
                        className="glass-card p-8"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <Lightbulb className="w-6 h-6 text-emerald-500" />
                            Recommended Actions
                        </h2>
                        <div className="space-y-4">
                            {activeRecommendations.length === 0 ? (
                                <p className="text-gray-400 italic">No actions recommended at this time.</p>
                            ) : (
                                activeRecommendations.map((action, idx) => (
                                    <motion.div
                                        key={idx}
                                        className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-semibold text-white">
                                                {action.title || action.actionType}
                                            </h3>
                                            <span
                                                className="px-3 py-1 rounded-md text-xs font-bold uppercase bg-emerald-500/20 text-emerald-500"
                                            >
                                                {action.priority || 'Medium'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-400">
                                            {action.description || 'Follow standard maintenance procedures.'}
                                        </p>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* AI Insight */}
                <motion.div
                    className="glass-card p-8 relative overflow-hidden bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 border-emerald-500/30"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="absolute top-0 right-0 p-32 bg-emerald-500/10 blur-[100px] rounded-full" />
                    <h2 className="text-2xl font-bold text-emerald-400 mb-4 flex items-center gap-2 relative z-10">
                        <Sparkles className="w-6 h-6" />
                        AI Analysis
                    </h2>
                    <p className="text-lg text-gray-200 leading-relaxed relative z-10">
                        {/* Mock AI Insight until backend provides one logic */}
                        {project.healthScore > 80
                            ? "Based on current growth patterns and environmental conditions, your project is performing exceptionally well. The species diversity is likely optimal, and soil health indicators would show strong improvement. Continue current maintenance schedule."
                            : project.healthScore > 50
                                ? "The project is showing stable growth but requires monitoring. Recent environmental fluctuations might affect soil moisture. Consider reviewing irrigation schedules."
                                : "Immediate attention required. Multiple risk factors identified. Please review active risks and implement recommended actions to prevent further degradation."
                        }
                    </p>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}