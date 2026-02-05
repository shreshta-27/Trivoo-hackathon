import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import { recommendations } from '../utils/api';
import {
    ArrowLeft,
    Lightbulb,
    TrendingUp,
    AlertTriangle,
    CheckCircle2,
    Sparkles,
    Target,
    Zap,
} from 'lucide-react';

export default function RecommendedActions() {
    const router = useRouter();
    const [actions, setActions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userInfoStr = localStorage.getItem('userInfo');
        if (userInfoStr) {
            try {
                setUser(JSON.parse(userInfoStr));
            } catch (e) {
                console.error("Error parsing user info", e);
            }
        }
    }, []);

    useEffect(() => {
        const fetchActions = async () => {
            // Need user ID to fetch all recommendations for user
            // If we don't have user ID in state yet (due to useEffect timing), wait or rely on other mechanism
            // But usually we can get it from localStorage directly here too
            const userInfoStr = localStorage.getItem('userInfo');
            let userId = null;
            if (userInfoStr) {
                try {
                    const u = JSON.parse(userInfoStr);
                    userId = u._id || u.id;
                } catch (e) { }
            }

            if (!userId) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const res = await recommendations.getUserRecommendations(userId);
                if (res.data?.data) {
                    const fetchedActions = res.data.data.map(item => ({
                        id: item._id || item.id,
                        action: item.title || item.actionType, // Adjust key based on checkActiveRisksAndRecommend/model
                        project: item.project?.name || 'Unknown Project',
                        projectId: item.project?._id || item.project,
                        priority: item.priority || 'medium',
                        confidence: item.confidenceScore || 80, // Default if missing
                        reason: item.reason || item.description || 'Action recommended based on recent analysis.',
                        status: item.status
                    }));

                    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
                    const sortedActions = fetchedActions.sort(
                        (a, b) => (priorityOrder[a.priority] || 99) - (priorityOrder[b.priority] || 99)
                    );
                    setActions(sortedActions);
                }
            } catch (error) {
                console.error("Failed to fetch recommendations", error);
            } finally {
                setLoading(false);
            }
        };

        fetchActions();
    }, []);

    const getPriorityConfig = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'critical':
                return {
                    color: '#ef4444',
                    icon: AlertTriangle,
                    label: 'CRITICAL',
                    gradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.1))',
                };
            case 'high':
                return {
                    color: '#f59e0b',
                    icon: TrendingUp,
                    label: 'HIGH',
                    gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.1))',
                };
            case 'medium':
                return {
                    color: '#3b82f6',
                    icon: Target,
                    label: 'MEDIUM',
                    gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.1))',
                };
            case 'low':
                return {
                    color: '#10b981',
                    icon: CheckCircle2,
                    label: 'LOW',
                    gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.1))',
                };
            default:
                return {
                    color: '#6b7280',
                    icon: Lightbulb,
                    label: 'UNKNOWN',
                    gradient: 'linear-gradient(135deg, rgba(107, 114, 128, 0.2), rgba(75, 85, 99, 0.1))',
                };
        }
    };

    if (loading) {
        return (
            <DashboardLayout activePage="dashboard">
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full mb-4"
                    />
                    <p className="text-gray-400">Loading recommended actions...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout activePage="dashboard">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <motion.button
                    onClick={() => router.push('/dashboard')}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-gray-300 font-semibold mb-8 hover:bg-white/15 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </motion.button>

                {/* Header */}
                <motion.div
                    className="mb-10"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center gap-4 mb-3">
                        <motion.div
                            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-400 flex items-center justify-center shadow-lg shadow-emerald-500/30"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                            <Zap className="w-7 h-7 text-white" />
                        </motion.div>
                        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-emerald-400">
                            Recommended Actions
                        </h1>
                    </div>
                    <p className="text-lg text-gray-400 ml-[72px]">
                        Priority actions ranked by urgency and impact. Click any action to view project details.
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {[
                        { label: 'Total Actions', value: actions.length, color: 'var(--emerald-green)' },
                        {
                            label: 'Critical',
                            value: actions.filter((a) => a.priority === 'critical').length,
                            color: '#ef4444',
                        },
                        {
                            label: 'High Priority',
                            value: actions.filter((a) => a.priority === 'high').length,
                            color: '#f59e0b',
                        },
                        {
                            label: 'Avg Confidence',
                            value: actions.length > 0 ? `${Math.round(actions.reduce((sum, a) => sum + a.confidence, 0) / actions.length)}%` : '0%',
                            color: '#3b82f6',
                        },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            className="glass-card p-5 text-center"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + index * 0.05 }}
                            whileHover={{ scale: 1.05, y: -4 }}
                        >
                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">{stat.label}</p>
                            <p className="text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Actions List */}
                <div className="space-y-5">
                    {actions.map((action, index) => {
                        const config = getPriorityConfig(action.priority);
                        const PriorityIcon = config.icon;
                        return (
                            <motion.div
                                key={action.id}
                                className="glass-card relative overflow-hidden cursor-pointer group"
                                style={{ borderLeft: `4px solid ${config.color}` }}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + index * 0.08, duration: 0.4 }}
                                whileHover={{ scale: 1.01, x: 4 }}
                                onClick={() => router.push(`/project-detail?id=${action.projectId}`)}
                            >
                                {/* Gradient Background */}
                                <div
                                    className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"
                                    style={{ background: config.gradient }}
                                />

                                <div className="relative z-10 p-6 sm:p-7 flex flex-col md:flex-row gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div
                                                className="flex items-center gap-2 px-3 py-1 rounded-lg border text-xs font-bold uppercase tracking-wider"
                                                style={{
                                                    background: `${config.color}15`,
                                                    borderColor: `${config.color}40`,
                                                    color: config.color
                                                }}
                                            >
                                                <PriorityIcon className="w-3.5 h-3.5" />
                                                {config.label}
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-4 leading-snug">
                                            {action.action}
                                        </h3>

                                        <div className="flex items-center gap-2 text-sm">
                                            <Lightbulb className="w-4 h-4 text-emerald-500" />
                                            <span className="text-gray-400">Project:</span>
                                            <span className="font-semibold text-emerald-400">{action.project}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4 min-w-[240px]">
                                        <div className="glass-card bg-white/5 p-4 rounded-xl border-white/10">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Confidence</span>
                                                <Sparkles className="w-4 h-4 text-emerald-500" />
                                            </div>
                                            <div className="text-2xl font-bold text-emerald-400">
                                                {action.confidence}%
                                            </div>
                                        </div>

                                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Reason</p>
                                            <p className="text-sm text-gray-300 leading-relaxed">
                                                {action.reason}
                                            </p>
                                        </div>
                                    </div>

                                    <div
                                        className="absolute bottom-6 right-6 text-sm font-semibold flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-all transform group-hover:translate-x-1"
                                        style={{ color: config.color }}
                                    >
                                        View Project <span>→</span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}

                    {actions.length === 0 && (
                        <motion.div
                            className="glass-card py-16 text-center"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-white mb-2">All Clear!</h3>
                            <p className="text-gray-400">
                                No recommended actions at this time. All projects are performing optimally.
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}