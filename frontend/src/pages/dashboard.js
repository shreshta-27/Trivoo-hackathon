import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { analytics, map } from '../utils/api';
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
    const [loading, setLoading] = useState(true);
    const [summaryData, setSummaryData] = useState({
        totalRegions: 0,
        totalProjects: 0,
        projectsAtRisk: 0,
        criticalAlerts: 0,
    });
    const [regions, setRegions] = useState([]);
    const [riskSignals, setRiskSignals] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!router.isReady) return;

        const fetchData = async () => {
            // Check for token in URL query params (from Google Auth redirect)
            const { token } = router.query;
            if (token) {
                localStorage.setItem('token', token);
                // Clean URL
                router.replace('/dashboard', undefined, { shallow: true });
            }

            const storedToken = localStorage.getItem('token');
            const userInfoStr = localStorage.getItem('userInfo');

            if (!storedToken && !userInfoStr && !token) {
                router.push('/');
                return;
            }

            let userInfo;
            try {
                userInfo = JSON.parse(userInfoStr || '{}');
                // If userInfo is just an object without _id (e.g. from just raw token decode), we might need to fetch profile.
                // But typically login returns user info.
            } catch (e) {
                userInfo = {};
            }
            setUser(userInfo);

            // For now, if we don't have userID, we can't fetch user-specific dashboard.
            // Assumption: userInfo has _id or id.
            const userId = userInfo?._id || userInfo?.user?._id || userInfo?.id;

            if (!userId && storedToken) {
                // Potentially fetch profile if ID missing? For now assuming ID is there.
                // Fallback or just try generic?
            }

            try {
                setLoading(true);
                // Parallel fetch
                const [dashboardRes, mapRes] = await Promise.all([
                    userId ? analytics.getUserDashboard(userId) : Promise.resolve({ data: { data: null } }),
                    map.getData()
                ]);

                if (dashboardRes.data?.data) {
                    const data = dashboardRes.data.data;
                    setSummaryData({
                        totalRegions: mapRes.data?.data?.length || 0, // Approximate from map data
                        totalProjects: data.overview.totalProjects,
                        projectsAtRisk: data.overview.criticalProjects + data.overview.highRiskProjects,
                        criticalAlerts: data.overview.criticalProjects, // Using critical projects as alerts for now
                    });
                } else if (mapRes.data?.data) {
                    // Fallback if user dashboard fails or no user
                    const allRegions = mapRes.data.data;
                    const totalProjects = allRegions.reduce((sum, r) => sum + r.projectCount, 0);
                    // Very rough approximation if dashboard API not ready
                    setSummaryData({
                        totalRegions: allRegions.length,
                        totalProjects: totalProjects,
                        projectsAtRisk: 0,
                        criticalAlerts: 0
                    });
                }

                if (mapRes.data?.data) {
                    const mappedRegions = mapRes.data.data.map(r => ({
                        id: r.id,
                        name: r.name,
                        projects: r.projectCount,
                        atRisk: r.projects ? r.projects.filter(p => p.riskLevel === 'critical' || p.riskLevel === 'high').length : 0, // Need to inspect real shape
                        trend: 'stable' // Hardcoded for now, backend doesn't seem to return trend
                    }));
                    setRegions(mappedRegions);
                }

                // Temporary: Mock risk signals if backend doesn't provide direct feed yet
                // Or derive from mapRes.data.projects activeRisks
                const signals = [];
                if (mapRes.data?.data) {
                    mapRes.data.data.forEach(region => {
                        if (region.projects) {
                            region.projects.forEach(p => {
                                if (p.activeRisks && p.activeRisks.length > 0) {
                                    p.activeRisks.forEach(risk => {
                                        signals.push({
                                            id: p.id + risk.type,
                                            type: risk.type,
                                            severity: risk.severity || 'medium',
                                            region: region.name,
                                            source: 'Monitoring System', // default
                                            icon: getIconForRisk(risk.type)
                                        });
                                    });
                                }
                            });
                        }
                    });
                }
                // Slice to max 5
                setRiskSignals(signals.slice(0, 5));

            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router.isReady, router.query]);

    const getIconForRisk = (type) => {
        if (!type) return Activity;
        const lower = type.toLowerCase();
        if (lower.includes('fire')) return Flame;
        if (lower.includes('water') || lower.includes('flood') || lower.includes('bleach')) return Droplet;
        if (lower.includes('wind') || lower.includes('air')) return Wind;
        return Activity;
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical': return '#ef4444';
            case 'high': return '#f59e0b';
            case 'medium': return '#eab308';
            default: return 'var(--emerald-green)';
        }
    };

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

    if (loading) {
        return (
            <DashboardLayout activePage="dashboard">
                <div className="flex items-center justify-center h-full">
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

    return (
        <DashboardLayout activePage="dashboard">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header with User Profile */}
                <motion.div
                    className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-br from-white to-emerald-400">
                            Control Room
                        </h1>
                        <p className="text-base text-gray-400">
                            Real-time environmental monitoring and risk assessment
                        </p>
                    </div>

                    {/* User Profile */}
                    <motion.div
                        className="glass-card flex items-center gap-3 px-4 py-3 cursor-pointer"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        whileHover={{ scale: 1.05, boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => router.push('/my-profile')}
                    >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-400 flex items-center justify-center text-white font-semibold">
                            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white mb-0.5">
                                {user?.name || 'User'}
                            </p>
                            <p className="text-xs text-gray-400">
                                {user?.email || 'user@trivo.io'}
                            </p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Summary Cards */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    {summaryCards.map((card, index) => {
                        const Icon = card.icon;
                        return (
                            <motion.div
                                key={card.title}
                                className="glass-card p-6 relative overflow-hidden"
                                style={{
                                    cursor: card.clickable ? 'pointer' : 'default',
                                }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                                whileHover={card.clickable ? { scale: 1.05, y: -8, boxShadow: `0 20px 60px ${card.color}50, 0 0 40px ${card.color}30` } : { scale: 1.03, y: -4 }}
                                whileTap={card.clickable ? { scale: 0.98, y: -4 } : {}}
                                onClick={() => card.clickable && router.push(card.route)}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <motion.div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                                        style={{ background: `${card.color}20` }}
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                    >
                                        <Icon style={{ width: '24px', height: '24px', color: card.color }} />
                                    </motion.div>
                                    {card.clickable && (
                                        <motion.div
                                            className="text-xs font-semibold flex items-center gap-1"
                                            style={{ color: card.color }}
                                            whileHover={{ x: 4 }}
                                        >
                                            View <span>→</span>
                                        </motion.div>
                                    )}
                                </div>
                                <h3 className="text-3xl font-bold mb-2" style={{ color: card.color }}>
                                    {card.value}
                                </h3>
                                <p className="text-sm text-gray-400">
                                    {card.title}
                                </p>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Region Overview */}
                <motion.div
                    className="mb-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    <h2 className="text-2xl font-semibold mb-6 text-white">Region Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {regions.map((region, index) => (
                            <motion.div
                                key={region.id}
                                className="glass-card p-5 cursor-pointer relative"
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
                                <div className="flex items-center gap-3 mb-4">
                                    <MapPin className="w-5 h-5 text-emerald-500" />
                                    <h3 className="text-lg font-semibold text-white flex-1">{region.name}</h3>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">Projects</p>
                                        <p className="text-xl font-semibold text-emerald-400">{region.projects}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">At Risk</p>
                                        <p className={`text-xl font-semibold ${region.atRisk > 0 ? 'text-amber-500' : 'text-emerald-400'}`}>
                                            {region.atRisk}
                                        </p>
                                    </div>
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${region.trend === 'up' ? 'bg-red-500/10' : 'bg-emerald-500/10'}`}>
                                        <TrendingUp className={`w-4 h-4 ${region.trend === 'up' ? 'text-red-500' : 'text-emerald-500'} ${region.trend === 'down' ? 'rotate-180' : ''}`} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Active Risk Signals */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                >
                    <h2 className="text-2xl font-semibold mb-6 text-white">Active Risk Signals</h2>
                    <div className="flex flex-col gap-4">
                        {riskSignals.length === 0 ? (
                            <p className="text-gray-400">No active risk signals detected.</p>
                        ) : (
                            riskSignals.map((signal, index) => {
                                const Icon = signal.icon;
                                const severityColor = getSeverityColor(signal.severity);
                                return (
                                    <motion.div
                                        key={signal.id}
                                        className="glass-card p-5 cursor-pointer flex items-center gap-5"
                                        style={{ borderLeft: `3px solid ${severityColor}` }}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 1 + index * 0.1, duration: 0.4 }}
                                        whileHover={{ scale: 1.02, x: 4, backgroundColor: 'rgba(255,255,255,0.03)' }}
                                        onClick={() => router.push(`/project-detail?id=${signal.id.replace(signal.type, '')}`)} // Hacky ID separation
                                    >
                                        <div
                                            className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                                            style={{ background: `${severityColor}20` }}
                                        >
                                            <Icon style={{ width: '28px', height: '28px', color: severityColor }} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-white mb-1">{signal.type}</h3>
                                            <div className="flex flex-wrap gap-4 items-center text-sm text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3.5 h-3.5" /> {signal.region}
                                                </span>
                                                <span>Source: {signal.source}</span>
                                            </div>
                                        </div>
                                        <div
                                            className="px-4 py-2 rounded-lg text-sm font-bold uppercase hidden sm:block"
                                            style={{ background: `${severityColor}20`, color: severityColor }}
                                        >
                                            {signal.severity}
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                    </div>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}