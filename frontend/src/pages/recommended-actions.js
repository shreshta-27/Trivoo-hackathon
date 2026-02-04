import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
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

    useEffect(() => {
        // Simulate API call to GET /actions
        const fetchActions = async () => {
            setLoading(true);
            // Mock data - replace with actual API call later
            const mockActions = [
                {
                    id: 1,
                    action: 'Increase irrigation in sector 3 to prevent drought stress',
                    project: 'Amazon Reforestation Initiative',
                    projectId: 1,
                    priority: 'critical',
                    confidence: 95,
                    reason: 'Satellite data shows soil moisture levels 40% below optimal. Immediate action required to prevent seedling loss.',
                },
                {
                    id: 2,
                    action: 'Deploy fire monitoring sensors in high-risk zones',
                    project: 'Congo Basin Conservation',
                    projectId: 2,
                    priority: 'high',
                    confidence: 88,
                    reason: 'Increased deforestation activity detected within 5km radius. Early warning system critical for protection.',
                },
                {
                    id: 3,
                    action: 'Schedule coral health assessment for bleaching zones',
                    project: 'Great Barrier Reef Restoration',
                    projectId: 3,
                    priority: 'high',
                    confidence: 92,
                    reason: 'Water temperature 2°C above seasonal average. Coral bleaching risk elevated to 85%.',
                },
                {
                    id: 4,
                    action: 'Plant native ground cover to improve soil retention',
                    project: 'Amazon Reforestation Initiative',
                    projectId: 1,
                    priority: 'medium',
                    confidence: 78,
                    reason: 'Erosion patterns indicate 15% soil loss in sector 2. Ground cover will stabilize soil and enhance biodiversity.',
                },
                {
                    id: 5,
                    action: 'Install wildlife monitoring cameras in recovery zones',
                    project: 'Himalayan Ecosystem Recovery',
                    projectId: 4,
                    priority: 'medium',
                    confidence: 72,
                    reason: 'Track ecosystem recovery progress and validate biodiversity improvement metrics.',
                },
                {
                    id: 6,
                    action: 'Conduct community training on sustainable practices',
                    project: 'Pacific Islands Climate Adaptation',
                    projectId: 5,
                    priority: 'low',
                    confidence: 65,
                    reason: 'Long-term sustainability requires local engagement. Training will improve project adoption by 30%.',
                },
                {
                    id: 7,
                    action: 'Update carbon sequestration monitoring protocols',
                    project: 'Congo Basin Conservation',
                    projectId: 2,
                    priority: 'low',
                    confidence: 68,
                    reason: 'New measurement standards available. Updated protocols will improve accuracy by 20%.',
                },
            ];

            // Sort by priority: critical > high > medium > low
            const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
            const sortedActions = mockActions.sort(
                (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
            );

            setTimeout(() => {
                setActions(sortedActions);
                setLoading(false);
            }, 500);
        };

        fetchActions();
    }, []);

    const getPriorityConfig = (priority) => {
        switch (priority) {
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
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        style={{
                            width: '48px',
                            height: '48px',
                            border: '4px solid rgba(16, 185, 129, 0.2)',
                            borderTopColor: 'var(--emerald-green)',
                            borderRadius: '50%',
                            margin: '0 auto',
                        }}
                    />
                    <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
                        Loading recommended actions...
                    </p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout activePage="dashboard">
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Back Button */}
                <motion.button
                    onClick={() => router.push('/dashboard')}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid var(--glass-border)',
                        color: 'var(--text-secondary)',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        marginBottom: '2rem',
                    }}
                    whileHover={{ scale: 1.02, background: 'rgba(255, 255, 255, 0.15)' }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <ArrowLeft style={{ width: '16px', height: '16px' }} />
                    Back to Dashboard
                </motion.button>

                {/* Header */}
                <motion.div
                    style={{ marginBottom: '2.5rem' }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                        <motion.div
                            style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '14px',
                                background: 'linear-gradient(135deg, var(--emerald-green), var(--bright-green))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                        >
                            <Zap style={{ width: '28px', height: '28px', color: '#000' }} />
                        </motion.div>
                        <h1
                            style={{
                                fontSize: '2.5rem',
                                fontWeight: '700',
                                background: 'linear-gradient(135deg, var(--text-primary), var(--emerald-green))',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            Recommended Actions
                        </h1>
                    </div>
                    <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', marginLeft: '72px' }}>
                        Priority actions ranked by urgency and impact. Click any action to view project details.
                    </p>
                </motion.div>

                {/* Stats Summary */}
                <motion.div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '1rem',
                        marginBottom: '2.5rem',
                    }}
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
                            value: `${Math.round(actions.reduce((sum, a) => sum + a.confidence, 0) / actions.length)}%`,
                            color: '#3b82f6',
                        },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            className="glass-card"
                            style={{ padding: '1.25rem', textAlign: 'center' }}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + index * 0.05 }}
                            whileHover={{ scale: 1.05, y: -4 }}
                        >
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                {stat.label}
                            </p>
                            <p style={{ fontSize: '1.75rem', fontWeight: '700', color: stat.color }}>{stat.value}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Action Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {actions.map((action, index) => {
                        const config = getPriorityConfig(action.priority);
                        const PriorityIcon = config.icon;

                        return (
                            <motion.div
                                key={action.id}
                                className="glass-card"
                                style={{
                                    padding: '1.75rem',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    borderLeft: `4px solid ${config.color}`,
                                }}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + index * 0.08, duration: 0.4 }}
                                whileHover={{
                                    scale: 1.02,
                                    y: -6,
                                    boxShadow: `0 20px 60px ${config.color}50, 0 0 40px ${config.color}30`,
                                    borderLeftWidth: '6px',
                                }}
                                whileTap={{ scale: 0.99, y: -3 }}
                                onClick={() => router.push(`/project-detail?id=${action.projectId}`)}
                            >
                                {/* Background Gradient */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        background: config.gradient,
                                        opacity: 0.5,
                                        pointerEvents: 'none',
                                    }}
                                />

                                <div style={{ position: 'relative', zIndex: 1 }}>
                                    {/* Header Row */}
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            justifyContent: 'space-between',
                                            marginBottom: '1rem',
                                            gap: '1rem',
                                        }}
                                    >
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                                <motion.div
                                                    style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        borderRadius: '10px',
                                                        background: `${config.color}30`,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        flexShrink: 0,
                                                    }}
                                                    animate={
                                                        action.priority === 'critical'
                                                            ? { scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }
                                                            : {}
                                                    }
                                                    transition={
                                                        action.priority === 'critical'
                                                            ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                                                            : {}
                                                    }
                                                    whileHover={{ scale: 1.15, rotate: 10 }}
                                                >
                                                    <PriorityIcon style={{ width: '20px', height: '20px', color: config.color }} />
                                                </motion.div>
                                                <motion.div
                                                    style={{
                                                        padding: '0.4rem 0.9rem',
                                                        borderRadius: '8px',
                                                        background: `${config.color}25`,
                                                        border: `1.5px solid ${config.color}`,
                                                        fontSize: '0.75rem',
                                                        fontWeight: '700',
                                                        color: config.color,
                                                        letterSpacing: '0.5px',
                                                    }}
                                                    whileHover={{ scale: 1.05, backgroundColor: `${config.color}35` }}
                                                >
                                                    {config.label}
                                                </motion.div>
                                            </div>
                                            <h3
                                                style={{
                                                    fontSize: '1.25rem',
                                                    fontWeight: '600',
                                                    color: 'var(--text-primary)',
                                                    lineHeight: '1.4',
                                                }}
                                            >
                                                {action.action}
                                            </h3>
                                        </div>

                                        {/* Confidence Score */}
                                        <motion.div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                padding: '0.75rem 1rem',
                                                borderRadius: '12px',
                                                background: 'rgba(255, 255, 255, 0.08)',
                                                border: '1px solid var(--glass-border)',
                                                minWidth: '90px',
                                            }}
                                            whileHover={{ scale: 1.05, background: 'rgba(255, 255, 255, 0.12)' }}
                                        >
                                            <Sparkles style={{ width: '18px', height: '18px', color: 'var(--emerald-green)', marginBottom: '0.25rem' }} />
                                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                                Confidence
                                            </p>
                                            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--emerald-green)' }}>
                                                {action.confidence}%
                                            </p>
                                        </motion.div>
                                    </div>

                                    {/* Project Name */}
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            marginBottom: '1rem',
                                            padding: '0.5rem 0',
                                        }}
                                    >
                                        <Lightbulb style={{ width: '16px', height: '16px', color: 'var(--emerald-green)' }} />
                                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                                            Project: <span style={{ color: 'var(--emerald-green)', fontWeight: '600' }}>{action.project}</span>
                                        </p>
                                    </div>

                                    {/* Reason */}
                                    <div
                                        style={{
                                            padding: '1rem',
                                            borderRadius: '10px',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid var(--glass-border)',
                                        }}
                                    >
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            Reason
                                        </p>
                                        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                            {action.reason}
                                        </p>
                                    </div>

                                    {/* Click Indicator */}
                                    <motion.div
                                        style={{
                                            position: 'absolute',
                                            bottom: '1.25rem',
                                            right: '1.5rem',
                                            fontSize: '0.8rem',
                                            color: config.color,
                                            fontWeight: '600',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem',
                                        }}
                                        initial={{ opacity: 0.6 }}
                                        whileHover={{ opacity: 1, x: 4 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        View Project
                                        <motion.span
                                            animate={{ x: [0, 4, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                        >
                                            →
                                        </motion.span>
                                    </motion.div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Empty State (if no actions) */}
                {actions.length === 0 && (
                    <motion.div
                        className="glass-card"
                        style={{
                            padding: '4rem 2rem',
                            textAlign: 'center',
                        }}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <CheckCircle2 style={{ width: '64px', height: '64px', color: 'var(--emerald-green)', margin: '0 auto 1rem' }} />
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                            All Clear!
                        </h3>
                        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
                            No recommended actions at this time. All projects are performing optimally.
                        </p>
                    </motion.div>
                )}
            </div>
        </DashboardLayout>
    );
}
