import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import { news } from '../utils/api';
import {
    AlertTriangle,
    Flame,
    TreePine,
    Cloud,
    Droplets,
    CloudRain,
    MapPin,
    Clock,
    ChevronRight,
    Search,
    Filter
} from 'lucide-react';

export default function Incidents() {
    const router = useRouter();
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const canvasRef = useRef(null);

    useEffect(() => {
        fetchIncidents();
    }, []);

    const fetchIncidents = async () => {
        try {
            setLoading(true);
            // Try to fetch user specific incidents/feed
            // If API fails or returns empty, we might want to show some global defaults or empty state
            const res = await news.getUserIncidents();
            if (res.data?.data) {
                setIncidents(res.data.data.map(item => ({
                    id: item._id || item.id,
                    headline: item.title || 'Untitled Incident',
                    riskType: item.type?.toLowerCase() || 'general',
                    location: item.location || item.project?.region?.name || 'Unknown Location',
                    severity: item.severity?.toLowerCase() || 'medium',
                    timestamp: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent',
                    projectId: item.project?._id || item.project,
                    description: item.description || 'No description available.'
                })));
            } else {
                // If no data, maybe try feed
                const feedRes = await news.getFeed();
                if (feedRes.data?.data) {
                    setIncidents(feedRes.data.data.map(item => ({
                        id: item._id || item.id,
                        headline: item.title,
                        riskType: item.type?.toLowerCase() || 'general',
                        location: item.location || 'Global',
                        severity: item.severity?.toLowerCase() || 'medium',
                        timestamp: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent',
                        projectId: item.project,
                        description: item.description
                    })));
                }
            }
        } catch (error) {
            console.error("Failed to fetch incidents", error);
        } finally {
            setLoading(false);
        }
    };

    // Particle Animation Effect
    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        const particles = [];
        const colors = ['rgba(239, 68, 68, 0.4)', 'rgba(249, 115, 22, 0.4)', 'rgba(251, 146, 60, 0.4)'];

        for (let i = 0; i < 30; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                color: colors[Math.floor(Math.random() * colors.length)],
            });
        }

        let animationId;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Optional: Draw specific background tint if needed, but usually handled by CSS

            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
            });
            animationId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const getRiskTypeConfig = (riskType) => {
        const configs = {
            wildfire: { icon: Flame, color: '#ef4444', label: 'Wildfire', bgGradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05))' },
            deforestation: { icon: TreePine, color: '#f97316', label: 'Deforestation', bgGradient: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(234, 88, 12, 0.05))' },
            pollution: { icon: Cloud, color: '#8b5cf6', label: 'Pollution', bgGradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(124, 58, 237, 0.05))' },
            drought: { icon: Droplets, color: '#f59e0b', label: 'Drought', bgGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.05))' },
            flood: { icon: CloudRain, color: '#3b82f6', label: 'Flood', bgGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05))' },
            general: { icon: AlertTriangle, color: '#6b7280', label: 'General', bgGradient: 'linear-gradient(135deg, rgba(107, 114, 128, 0.1), rgba(75, 85, 99, 0.05))' }
        };
        return configs[riskType] || configs.general;
    };

    const getSeverityConfig = (severity) => {
        const configs = {
            low: { color: '#3b82f6', label: 'Low', bg: 'rgba(59, 130, 246, 0.15)' },
            medium: { color: '#f59e0b', label: 'Medium', bg: 'rgba(245, 158, 11, 0.15)' },
            high: { color: '#f97316', label: 'High', bg: 'rgba(249, 115, 22, 0.15)' },
            critical: { color: '#ef4444', label: 'Critical', bg: 'rgba(239, 68, 68, 0.15)' },
        };
        return configs[severity] || configs.medium;
    };

    const handleIncidentClick = (projectId) => {
        if (projectId) {
            router.push(`/project-detail?id=${projectId}`);
        }
    };

    return (
        <DashboardLayout activePage="incidents">
            <canvas
                ref={canvasRef}
                className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-30"
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                {/* Header */}
                <motion.div
                    className="mb-10"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center gap-4 mb-3">
                        <motion.div
                            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                        >
                            <AlertTriangle className="w-7 h-7 text-white" />
                        </motion.div>
                        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-red-400">
                            Incidents & News
                        </h1>
                    </div>
                    <p className="text-lg text-gray-400 ml-[72px]">
                        Stay informed about environmental events and human activities
                    </p>
                </motion.div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-12 h-12 border-4 border-red-500/20 border-t-red-500 rounded-full mb-4"
                        />
                        <p className="text-gray-400">Loading incidents...</p>
                    </div>
                ) : incidents.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                        <AlertTriangle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No Recent Incidents</h3>
                        <p className="text-gray-400">There are no active incidents reported in your regions.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {incidents.map((incident, index) => {
                            const riskConfig = getRiskTypeConfig(incident.riskType);
                            const severityConfig = getSeverityConfig(incident.severity);
                            const RiskIcon = riskConfig.icon;

                            return (
                                <motion.div
                                    key={incident.id}
                                    className="glass-card p-6 cursor-pointer relative overflow-hidden group border-l-4"
                                    style={{
                                        background: riskConfig.bgGradient,
                                        borderLeftColor: severityConfig.color
                                    }}
                                    initial={{ opacity: 0, y: 20, rotateX: -10 }}
                                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                                    transition={{ delay: index * 0.08, duration: 0.5 }}
                                    whileHover={{
                                        scale: 1.02,
                                        y: -6,
                                        rotateY: 2,
                                        boxShadow: `0 20px 60px ${severityConfig.color}40`,
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleIncidentClick(incident.projectId)}
                                >
                                    {/* Critical Pulse Effect */}
                                    {incident.severity === 'critical' && (
                                        <motion.div
                                            className="absolute inset-0 pointer-events-none"
                                            style={{ background: `radial-gradient(circle at top left, ${severityConfig.color}20, transparent)` }}
                                            animate={{ opacity: [0.3, 0.6, 0.3] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                    )}

                                    <div className="flex justify-between items-center mb-4 relative z-10">
                                        <div
                                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border"
                                            style={{
                                                background: `${riskConfig.color}15`,
                                                borderColor: `${riskConfig.color}30`
                                            }}
                                        >
                                            <RiskIcon className="w-4 h-4" style={{ color: riskConfig.color }} />
                                            <span className="text-xs font-bold uppercase" style={{ color: riskConfig.color }}>
                                                {riskConfig.label}
                                            </span>
                                        </div>
                                        <div
                                            className="px-3 py-1.5 rounded-lg border"
                                            style={{
                                                background: severityConfig.bg,
                                                borderColor: `${severityConfig.color}30`
                                            }}
                                        >
                                            <span className="text-xs font-bold uppercase" style={{ color: severityConfig.color }}>
                                                {severityConfig.label}
                                            </span>
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold text-white mb-3 leading-tight relative z-10">
                                        {incident.headline}
                                    </h3>

                                    <div className="flex items-center gap-2 mb-3 text-sm text-gray-400 relative z-10">
                                        <MapPin className="w-4 h-4 text-emerald-500" />
                                        <span className="truncate">{incident.location}</span>
                                    </div>

                                    <div className="flex items-center gap-2 mb-4 text-xs text-gray-500 relative z-10">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>{incident.timestamp}</span>
                                    </div>

                                    <p className="text-sm text-gray-300 leading-relaxed mb-4 line-clamp-3 relative z-10">
                                        {incident.description}
                                    </p>

                                    {incident.projectId && (
                                        <motion.div
                                            className="flex items-center gap-1 text-sm font-semibold relative z-10"
                                            style={{ color: riskConfig.color }}
                                            whileHover={{ x: 4 }}
                                        >
                                            View Project Details
                                            <ChevronRight className="w-4 h-4" />
                                        </motion.div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}