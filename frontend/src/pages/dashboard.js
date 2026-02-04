import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import DashboardLayout from '../components/DashboardLayout';
import {
    Globe,
    FolderKanban,
    AlertTriangle,
    Bell,
    TrendingUp,
    MapPin,
    Activity,
    Flame,
    Droplet,
    Wind,
} from 'lucide-react';

export default function Dashboard() {
    const router = useRouter();

    // Mock Data
    const summaryData = {
        totalRegions: 12,
        totalProjects: 48,
        projectsAtRisk: 7,
        criticalAlerts: 3,
    };

    const regions = [
        { id: 1, name: 'Amazon Rainforest', projects: 12, atRisk: 2, trend: 'up' },
        { id: 2, name: 'Great Barrier Reef', projects: 8, atRisk: 1, trend: 'stable' },
        { id: 3, name: 'Arctic Circle', projects: 6, atRisk: 3, trend: 'up' },
        { id: 4, name: 'Congo Basin', projects: 10, atRisk: 0, trend: 'down' },
        { id: 5, name: 'Himalayan Region', projects: 7, atRisk: 1, trend: 'stable' },
        { id: 6, name: 'Pacific Islands', projects: 5, atRisk: 0, trend: 'stable' },
    ];

    const riskSignals = [
        {
            id: 1,
            type: 'Deforestation Spike',
            severity: 'critical',
            region: 'Amazon Rainforest',
            source: 'Satellite Data',
            icon: Flame,
        },
        {
            id: 2,
            type: 'Coral Bleaching',
            severity: 'high',
            region: 'Great Barrier Reef',
            source: 'Marine Sensors',
            icon: Droplet,
        },
        {
            id: 3,
            type: 'Ice Melt Acceleration',
            severity: 'critical',
            region: 'Arctic Circle',
            source: 'Climate Models',
            icon: Wind,
        },
        {
            id: 4,
            type: 'Air Quality Alert',
            severity: 'medium',
            region: 'Himalayan Region',
            source: 'Ground Stations',
            icon: Activity,
        },
    ];

    const summaryCards = [
        {
            title: 'Total Regions',
            value: summaryData.totalRegions,
            icon: Globe,
            color: 'var(--emerald-green)',
            clickable: false,
        },
        {
            title: 'Total Projects',
            value: summaryData.totalProjects,
            icon: FolderKanban,
            color: 'var(--bright-green)',
            clickable: false,
        },
        {
            title: 'Projects at Risk',
            value: summaryData.projectsAtRisk,
            icon: AlertTriangle,
            color: '#f59e0b',
            clickable: true,
            route: '/recommended-actions',
        },
        {
            title: 'Critical Alerts',
            value: summaryData.criticalAlerts,
            icon: Bell,
            color: '#ef4444',
            clickable: false,
        },
    ];

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical':
                return '#ef4444';
            case 'high':
                return '#f59e0b';
            case 'medium':
                return '#eab308';
            default:
                return 'var(--emerald-green)';
        }
    };

    return (
        <DashboardLayout activePage="dashboard">
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Header */}
                <motion.div
                    style={{ marginBottom: '2rem' }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1
                        style={{
                            fontSize: '2.5rem',
                            fontWeight: '700',
                            marginBottom: '0.5rem',
                            background: 'linear-gradient(135deg, var(--text-primary), var(--emerald-green))',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        Control Room
                    </h1>
                    <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
                        Real-time environmental monitoring and risk assessment
                    </p>
                </motion.div>

                {/* Summary Cards */}
                <motion.div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '1.5rem',
                        marginBottom: '3rem',
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    {summaryCards.map((card, index) => {
                        const Icon = card.icon;
                        return (
                            <motion.div
                                key={card.title}
                                className="glass-card"
                                style={{
                                    padding: '1.5rem',
                                    cursor: card.clickable ? 'pointer' : 'default',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                                whileHover={
                                    card.clickable
                                        ? {
                                            scale: 1.05,
                                            y: -8,
                                            boxShadow: `0 20px 60px ${card.color}50, 0 0 40px ${card.color}30`,
                                        }
                                        : { scale: 1.03, y: -4 }
                                }
                                whileTap={
                                    card.clickable
                                        ? { scale: 0.98, y: -4 }
                                        : {}
                                }
                                onClick={() => card.clickable && router.push(card.route)}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        justifyContent: 'space-between',
                                        marginBottom: '1rem',
                                    }}
                                >
                                    <motion.div
                                        style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '12px',
                                            background: `${card.color}20`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                                    >
                                        <motion.div
                                            whileHover={{ scale: 1.2, rotate: -5 }}
                                            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                                        >
                                            <Icon style={{ width: '24px', height: '24px', color: card.color }} />
                                        </motion.div>
                                    </motion.div>
                                </div>
                                <h3
                                    style={{
                                        fontSize: '2rem',
                                        fontWeight: '700',
                                        color: card.color,
                                        marginBottom: '0.5rem',
                                    }}
                                >
                                    {card.value}
                                </h3>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    {card.title}
                                </p>
                                {card.clickable && (
                                    <motion.div
                                        style={{
                                            position: 'absolute',
                                            top: '1rem',
                                            right: '1rem',
                                            fontSize: '0.75rem',
                                            color: card.color,
                                            fontWeight: '600',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem',
                                        }}
                                        initial={{ opacity: 0.7 }}
                                        whileHover={{ opacity: 1, x: 4 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        View
                                        <motion.span
                                            animate={{ x: [0, 4, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                        >
                                            →
                                        </motion.span>
                                    </motion.div>
                                )}
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Region Overview Section */}
                <motion.div
                    style={{ marginBottom: '3rem' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    <h2
                        style={{
                            fontSize: '1.5rem',
                            fontWeight: '600',
                            marginBottom: '1.5rem',
                            color: 'var(--text-primary)',
                        }}
                    >
                        Region Overview
                    </h2>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '1.25rem',
                        }}
                    >
                        {regions.map((region, index) => (
                            <motion.div
                                key={region.id}
                                className="glass-card"
                                style={{
                                    padding: '1.25rem',
                                    cursor: 'pointer',
                                    position: 'relative',
                                }}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.7 + index * 0.05, duration: 0.4 }}
                                whileHover={{
                                    scale: 1.05,
                                    y: -8,
                                    boxShadow: '0 20px 60px rgba(16, 185, 129, 0.3), 0 0 40px rgba(16, 185, 129, 0.2)',
                                }}
                                whileTap={{ scale: 0.98, y: -4 }}
                                onClick={() => router.push(`/map-view?region=${region.id}`)}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        marginBottom: '1rem',
                                    }}
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.2, rotate: 360 }}
                                        transition={{ duration: 0.6, ease: 'easeInOut' }}
                                    >
                                        <MapPin
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                color: 'var(--emerald-green)',
                                            }}
                                        />
                                    </motion.div>
                                    <h3
                                        style={{
                                            fontSize: '1rem',
                                            fontWeight: '600',
                                            color: 'var(--text-primary)',
                                            flex: 1,
                                        }}
                                    >
                                        {region.name}
                                    </h3>
                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <div>
                                        <p
                                            style={{
                                                fontSize: '0.75rem',
                                                color: 'var(--text-muted)',
                                                marginBottom: '0.25rem',
                                            }}
                                        >
                                            Projects
                                        </p>
                                        <motion.p
                                            style={{
                                                fontSize: '1.25rem',
                                                fontWeight: '600',
                                                color: 'var(--emerald-green)',
                                            }}
                                            whileHover={{ scale: 1.15, color: 'var(--bright-green)' }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {region.projects}
                                        </motion.p>
                                    </div>
                                    <div>
                                        <p
                                            style={{
                                                fontSize: '0.75rem',
                                                color: 'var(--text-muted)',
                                                marginBottom: '0.25rem',
                                            }}
                                        >
                                            At Risk
                                        </p>
                                        <motion.p
                                            style={{
                                                fontSize: '1.25rem',
                                                fontWeight: '600',
                                                color: region.atRisk > 0 ? '#f59e0b' : 'var(--emerald-green)',
                                            }}
                                            whileHover={{ scale: 1.15 }}
                                            animate={region.atRisk > 0 ? { scale: [1, 1.05, 1] } : {}}
                                            transition={region.atRisk > 0 ? { duration: 2, repeat: Infinity } : { duration: 0.2 }}
                                        >
                                            {region.atRisk}
                                        </motion.p>
                                    </div>
                                    <motion.div
                                        style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '8px',
                                            background:
                                                region.trend === 'up'
                                                    ? 'rgba(239, 68, 68, 0.1)'
                                                    : region.trend === 'down'
                                                        ? 'rgba(16, 185, 129, 0.1)'
                                                        : 'rgba(156, 163, 175, 0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                        whileHover={{ scale: 1.2, rotate: 15 }}
                                        transition={{ type: 'spring', stiffness: 300 }}
                                    >
                                        <TrendingUp
                                            style={{
                                                width: '16px',
                                                height: '16px',
                                                color:
                                                    region.trend === 'up'
                                                        ? '#ef4444'
                                                        : region.trend === 'down'
                                                            ? 'var(--emerald-green)'
                                                            : '#9ca3af',
                                                transform: region.trend === 'down' ? 'rotate(180deg)' : 'none',
                                            }}
                                        />
                                    </motion.div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Active Risk Signals Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                >
                    <h2
                        style={{
                            fontSize: '1.5rem',
                            fontWeight: '600',
                            marginBottom: '1.5rem',
                            color: 'var(--text-primary)',
                        }}
                    >
                        Active Risk Signals
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {riskSignals.map((signal, index) => {
                            const Icon = signal.icon;
                            const severityColor = getSeverityColor(signal.severity);

                            return (
                                <motion.div
                                    key={signal.id}
                                    className="glass-card"
                                    style={{
                                        padding: '1.25rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1.25rem',
                                        borderLeft: `3px solid ${severityColor}`,
                                    }}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1 + index * 0.1, duration: 0.4 }}
                                    whileHover={{
                                        scale: 1.03,
                                        y: -6,
                                        boxShadow: `0 20px 60px ${severityColor}40, 0 0 40px ${severityColor}30`,
                                        borderLeftWidth: '5px',
                                    }}
                                    whileTap={{ scale: 0.99, y: -3 }}
                                    onClick={() => router.push(`/project-detail?signal=${signal.id}`)}
                                >
                                    <motion.div
                                        style={{
                                            width: '56px',
                                            height: '56px',
                                            borderRadius: '12px',
                                            background: `${severityColor}20`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                        }}
                                        animate={
                                            signal.severity === 'critical'
                                                ? { scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }
                                                : signal.severity === 'high'
                                                    ? { scale: [1, 1.05, 1] }
                                                    : {}
                                        }
                                        transition={
                                            signal.severity === 'critical'
                                                ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
                                                : signal.severity === 'high'
                                                    ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                                                    : {}
                                        }
                                        whileHover={{ scale: 1.15, rotate: 10 }}
                                    >
                                        <motion.div
                                            whileHover={{ scale: 1.2, rotate: -10 }}
                                            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                                        >
                                            <Icon style={{ width: '28px', height: '28px', color: severityColor }} />
                                        </motion.div>
                                    </motion.div>
                                    <div style={{ flex: 1 }}>
                                        <h3
                                            style={{
                                                fontSize: '1.125rem',
                                                fontWeight: '600',
                                                color: 'var(--text-primary)',
                                                marginBottom: '0.5rem',
                                            }}
                                        >
                                            {signal.type}
                                        </h3>
                                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                                <MapPin
                                                    style={{
                                                        width: '14px',
                                                        height: '14px',
                                                        display: 'inline',
                                                        marginRight: '0.25rem',
                                                    }}
                                                />
                                                {signal.region}
                                            </p>
                                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                                Source: {signal.source}
                                            </p>
                                        </div>
                                    </div>
                                    <motion.div
                                        style={{
                                            padding: '0.5rem 1rem',
                                            borderRadius: '8px',
                                            background: `${severityColor}20`,
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            color: severityColor,
                                            textTransform: 'uppercase',
                                        }}
                                        animate={
                                            signal.severity === 'critical'
                                                ? { boxShadow: [`0 0 10px ${severityColor}40`, `0 0 20px ${severityColor}60`, `0 0 10px ${severityColor}40`] }
                                                : {}
                                        }
                                        transition={
                                            signal.severity === 'critical'
                                                ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                                                : {}
                                        }
                                        whileHover={{ scale: 1.05, backgroundColor: `${severityColor}30` }}
                                    >
                                        {signal.severity}
                                    </motion.div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
