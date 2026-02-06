import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import { projects as projectApi } from '../utils/api';
import {
    Zap,
    MapPin,
    TreePine,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    Droplets,
    Flame,
    CloudRain,
    Users,
    DollarSign,
    Clock,
    Sparkles,
    ArrowLeft,
    Play,
    RotateCcw,
    Save,
    Info,
    Loader
} from 'lucide-react';

export default function SimulationMode() {
    const router = useRouter();
    const [view, setView] = useState('selection'); // selection | sandbox
    const [selectedProject, setSelectedProject] = useState(null);
    const [projectList, setProjectList] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(true);

    const [scenarioType, setScenarioType] = useState('environmental');
    const [scenario, setScenario] = useState('drought');
    const [duration, setDuration] = useState(30);
    const [severity, setSeverity] = useState('medium');
    const [isSimulating, setIsSimulating] = useState(false);
    const [results, setResults] = useState(null);
    const [savedScenarios, setSavedScenarios] = useState([]);

    const canvasRef = useRef(null);

    // Fetch projects on mount
    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoadingProjects(true);
            const res = await projectApi.getAll();
            if (res.data?.data && res.data.data.length > 0) {
                setProjectList(res.data.data.map(p => ({
                    id: p._id || p.id,
                    name: p.name,
                    region: p.region?.name || 'Unknown Region',
                    treesPlanted: p.plantationSize || 0,
                    health: calculateHealthStatus(p.healthScore),
                    healthScore: p.healthScore || 100,
                })));
            } else {
                throw new Error("No projects found");
            }
        } catch (error) {
            console.error("Failed to fetch projects, using fallback", error);
            // Fallback Data for Demo
            setProjectList([
                {
                    id: 'demo-1',
                    name: 'Amazon Preservation Alpha',
                    region: 'South America',
                    treesPlanted: 12500,
                    health: 'healthy',
                    healthScore: 92,
                },
                {
                    id: 'demo-2',
                    name: 'Borneo Reforestation',
                    region: 'Southeast Asia',
                    treesPlanted: 8400,
                    health: 'critical',
                    healthScore: 45,
                },
                {
                    id: 'demo-3',
                    name: 'Congo Basin Initiative',
                    region: 'Central Africa',
                    treesPlanted: 15600,
                    health: 'warning',
                    healthScore: 78,
                },
                {
                    id: 'demo-4',
                    name: 'Alpine Recovery',
                    region: 'Europe',
                    treesPlanted: 3200,
                    health: 'healthy',
                    healthScore: 98,
                }
            ]);
        } finally {
            setLoadingProjects(false);
        }
    };

    const calculateHealthStatus = (score) => {
        if (!score && score !== 0) return 'healthy';
        if (score >= 80) return 'healthy';
        if (score >= 50) return 'warning';
        return 'critical';
    };

    const environmentalScenarios = [
        { id: 'drought', name: 'Drought', icon: Droplets, color: '#f59e0b' },
        { id: 'heatwave', name: 'Heatwave', icon: Flame, color: '#ef4444' },
        { id: 'flood', name: 'Heavy Rainfall', icon: CloudRain, color: '#3b82f6' },
        { id: 'wildfire', name: 'Wildfire Risk', icon: Flame, color: '#dc2626' },
    ];

    const actionScenarios = [
        { id: 'delay_irrigation', name: 'Delay Irrigation', icon: Droplets, color: '#f59e0b' },
        { id: 'reduced_manpower', name: 'Reduced Manpower', icon: Users, color: '#8b5cf6' },
        { id: 'budget_cut', name: 'Budget Cut', icon: DollarSign, color: '#ef4444' },
        { id: 'early_harvest', name: 'Early Harvest', icon: Clock, color: '#10b981' },
    ];

    // Particle Animation
    useEffect(() => {
        if (!canvasRef.current || !isSimulating) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        // Handle canvas sizing properly
        const updateSize = () => {
            if (canvas) {
                canvas.width = canvas.parentElement?.offsetWidth || 300;
                canvas.height = canvas.parentElement?.offsetHeight || 300;
            }
        };
        updateSize();
        window.addEventListener('resize', updateSize);

        const particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                radius: Math.random() * 3 + 1,
            });
        }

        let animationId;
        const animate = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p) => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(16, 185, 129, 0.6)';
                ctx.fill();
            });

            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', updateSize);
        };
    }, [isSimulating]);

    const getHealthColor = (health) => {
        switch (health) {
            case 'healthy':
                return '#10b981';
            case 'warning':
                return '#f59e0b';
            case 'critical':
                return '#ef4444';
            default:
                return '#6b7280';
        }
    };

    const getSeverityImpact = () => {
        const impacts = {
            low: { healthDrop: 5, riskIncrease: 'Low → Medium' },
            medium: { healthDrop: 15, riskIncrease: 'Low → High' },
            high: { healthDrop: 25, riskIncrease: 'Medium → Critical' },
            critical: { healthDrop: 35, riskIncrease: 'High → Critical' },
        };
        return impacts[severity] || impacts.medium;
    };

    const handleRunSimulation = () => {
        setIsSimulating(true);
        setResults(null);

        // Simulation delay
        setTimeout(() => {
            const impact = getSeverityImpact();
            // Simple logic: degrade health based on severity. In real app, this comes from backend ML model.
            const newHealthScore = Math.max(0, selectedProject.healthScore - impact.healthDrop);

            setResults({
                before: {
                    healthScore: selectedProject.healthScore,
                    riskLevel: 'Low', // Assumption for base
                    status: selectedProject.health,
                },
                after: {
                    healthScore: newHealthScore,
                    riskLevel: severity === 'critical' ? 'Critical' : severity === 'high' ? 'High' : 'Medium',
                    status: calculateHealthStatus(newHealthScore),
                },
                aiInsight: `Based on the ${scenarioType} scenario (${scenario}) with ${severity} severity over ${duration} days, your project's health score is projected to decrease by ${impact.healthDrop} points. ${severity === 'critical'
                    ? 'Immediate intervention is required to prevent catastrophic losses.'
                    : severity === 'high'
                        ? 'Significant mitigation measures should be implemented within 48 hours.'
                        : 'Moderate impact expected. Monitor closely and prepare contingency plans.'
                    } Recommended actions: ${scenarioType === 'environmental'
                        ? 'Increase irrigation frequency, deploy protective measures, and enhance monitoring systems.'
                        : 'Optimize resource allocation, adjust project timeline, and implement efficiency improvements.'
                    }`,
                confidence: 85 + Math.floor(Math.random() * 10), // Random confidence 85-95
            });
            setIsSimulating(false);
        }, 2500);
    };

    const handleSaveScenario = () => {
        if (results) {
            setSavedScenarios([
                ...savedScenarios,
                {
                    id: Date.now(),
                    project: selectedProject.name,
                    scenarioType,
                    scenario,
                    duration,
                    severity,
                    results,
                    timestamp: new Date().toLocaleString(),
                },
            ]);
        }
    };

    const handleReset = () => {
        setResults(null);
        setDuration(30);
        setSeverity('medium');
    };

    const handleExitSandbox = () => {
        setView('selection');
        setSelectedProject(null);
        setResults(null);
        setSavedScenarios([]);
    };

    const currentScenarios = scenarioType === 'environmental' ? environmentalScenarios : actionScenarios;
    // const currentScenarioData = currentScenarios.find((s) => s.id === scenario) || currentScenarios[0];

    if (view === 'selection') {
        return (
            <DashboardLayout activePage="simulation-mode">
                <div className="max-w-[1400px] mx-auto px-4 py-8">
                    {/* Header */}
                    <motion.div
                        className="mb-10"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center gap-4 mb-3">
                            <motion.div
                                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/30"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                            >
                                <Zap className="w-7 h-7 text-white" />
                            </motion.div>
                            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-gray-100 to-violet-400">
                                Decision Sandbox
                            </h1>
                        </div>
                        <p className="text-lg text-gray-400 ml-[72px]">
                            Test environmental scenarios and decisions without affecting real project data
                        </p>
                    </motion.div>

                    {/* Project Grid */}
                    {loadingProjects ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader className="w-10 h-10 text-violet-500 animate-spin" />
                        </div>
                    ) : projectList.length === 0 ? (
                        <div className="glass-card p-10 text-center">
                            <h3 className="text-xl font-bold text-white mb-2">No Projects Found</h3>
                            <p className="text-gray-400 mb-6">Create a project to start simulating scenarios.</p>
                            <button
                                onClick={() => router.push('/my-projects')}
                                className="px-6 py-3 bg-violet-600 rounded-xl text-white font-semibold hover:bg-violet-500 transition-colors"
                            >
                                Go to My Projects
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {projectList.map((project, index) => (
                                <motion.div
                                    key={project.id}
                                    className="glass-card p-6 cursor-pointer relative overflow-hidden group hover:border-violet-500/50 transition-colors"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                    whileHover={{
                                        scale: 1.03,
                                        y: -8,
                                        boxShadow: '0 20px 60px rgba(139, 92, 246, 0.3)',
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        setSelectedProject(project);
                                        setView('sandbox');
                                    }}
                                >
                                    <h3 className="text-xl font-bold text-white mb-4 truncate">
                                        {project.name}
                                    </h3>
                                    <div className="flex items-center gap-2 mb-3 text-sm text-gray-400">
                                        <MapPin className="w-4 h-4 text-violet-500" />
                                        <span className="truncate">{project.region}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mb-4 text-sm text-gray-400">
                                        <TreePine className="w-4 h-4 text-violet-500" />
                                        <span>{project.treesPlanted.toLocaleString()} trees</span>
                                    </div>

                                    <div
                                        className="flex justify-between items-center p-4 rounded-xl border transition-colors group-hover:bg-violet-500/10 group-hover:border-violet-500/30"
                                        style={{
                                            background: `${getHealthColor(project.health)}15`,
                                            borderColor: `${getHealthColor(project.health)}40`,
                                        }}
                                    >
                                        <span className="text-xs font-bold text-gray-400 uppercase">
                                            Current Health
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="w-4 h-4" style={{ color: getHealthColor(project.health) }} />
                                            <span
                                                className="text-2xl font-bold"
                                                style={{ color: getHealthColor(project.health) }}
                                            >
                                                {project.healthScore}%
                                            </span>
                                        </div>
                                    </div>

                                    <motion.div
                                        className="absolute bottom-5 right-6 text-sm font-semibold text-violet-400 flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity"
                                    >
                                        Enter Sandbox
                                        <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                                            →
                                        </motion.span>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout activePage="simulation-mode">
            <div className="max-w-[1400px] mx-auto px-4 py-8">
                {/* Sandbox View */}
                <motion.button
                    onClick={handleExitSandbox}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-gray-300 font-semibold hover:bg-white/20 transition-all mb-6"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <ArrowLeft className="w-4 h-4" />
                    Exit Sandbox
                </motion.button>

                <motion.div
                    className="p-4 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/10 border-2 border-violet-500/50 mb-8 flex items-start sm:items-center gap-4 text-gray-200"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Info className="w-6 h-6 text-violet-400 flex-shrink-0 mt-1 sm:mt-0" />
                    <p className="text-sm sm:text-base font-medium">
                        🔬 <strong>Simulation Mode Active:</strong> Real project data will not be changed. Test scenarios safely to understand potential impacts.
                    </p>
                </motion.div>

                <motion.div
                    className="glass-card p-6 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">
                                {selectedProject.name}
                            </h2>
                            <div className="flex items-center gap-6 text-gray-400 text-sm">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-violet-500" />
                                    <span>{selectedProject.region}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <TreePine className="w-4 h-4 text-violet-500" />
                                    <span>{selectedProject.treesPlanted.toLocaleString()} trees</span>
                                </div>
                            </div>
                        </div>
                        <div
                            className="px-6 py-4 rounded-2xl border-2 text-center"
                            style={{
                                background: `${getHealthColor(selectedProject.health)}20`,
                                borderColor: getHealthColor(selectedProject.health),
                            }}
                        >
                            <p className="text-xs text-gray-400 uppercase mb-1">Current Health</p>
                            <p className="text-3xl font-bold" style={{ color: getHealthColor(selectedProject.health) }}>
                                {selectedProject.healthScore}%
                            </p>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Controls */}
                    <div>
                        <motion.div
                            className="glass-card p-8"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h3 className="text-xl font-bold text-white mb-6">
                                Configure Scenario
                            </h3>

                            <div className="mb-8">
                                <label className="text-sm text-gray-400 mb-3 block">Scenario Type</label>
                                <div className="flex gap-3">
                                    {['environmental', 'action'].map((type) => (
                                        <motion.button
                                            key={type}
                                            onClick={() => {
                                                setScenarioType(type);
                                                setScenario(type === 'environmental' ? 'drought' : 'delay_irrigation');
                                            }}
                                            className={`flex-1 py-3.5 rounded-xl font-semibold text-sm transition-all border
                                                ${scenarioType === type
                                                    ? 'bg-violet-500/20 border-violet-500 text-violet-400'
                                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                                }`}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            {type === 'environmental' ? '🌍 Environmental' : '⚡ Action-Based'}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-8">
                                <label className="text-sm text-gray-400 mb-3 block">Select Scenario</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {currentScenarios.map((s) => {
                                        const Icon = s.icon;
                                        return (
                                            <motion.button
                                                key={s.id}
                                                onClick={() => setScenario(s.id)}
                                                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all
                                                    ${scenario === s.id
                                                        ? 'border-2'
                                                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                                                    }`}
                                                style={{
                                                    background: scenario === s.id ? `${s.color}20` : undefined,
                                                    borderColor: scenario === s.id ? s.color : undefined,
                                                    color: scenario === s.id ? 'white' : 'gray'
                                                }}
                                                whileHover={{ scale: 1.03, y: -2 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <Icon className="w-6 h-6" style={{ color: s.color }} />
                                                <span className="text-xs font-bold">{s.name}</span>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="mb-8">
                                <label className="text-sm text-gray-400 mb-3 block">
                                    Duration: <strong className="text-violet-400">{duration} days</strong>
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="90"
                                    value={duration}
                                    onChange={(e) => setDuration(parseInt(e.target.value))}
                                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                                    style={{
                                        background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${(duration / 90) * 100}%, rgba(255,255,255,0.1) ${(duration / 90) * 100}%, rgba(255,255,255,0.1) 100%)`
                                    }}
                                />
                                <div className="flex justify-between mt-2 text-xs text-gray-500">
                                    <span>1 day</span>
                                    <span>90 days</span>
                                </div>
                            </div>

                            <div className="mb-8">
                                <label className="text-sm text-gray-400 mb-3 block">Severity Level</label>
                                <select
                                    value={severity}
                                    onChange={(e) => setSeverity(e.target.value)}
                                    className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-violet-500 transition-colors cursor-pointer"
                                >
                                    <option value="low" className="bg-[#0f172a] text-gray-300">Low - Minimal Impact</option>
                                    <option value="medium" className="bg-[#0f172a] text-gray-300">Medium - Moderate Impact</option>
                                    <option value="high" className="bg-[#0f172a] text-gray-300">High - Significant Impact</option>
                                    <option value="critical" className="bg-[#0f172a] text-gray-300">Critical - Severe Impact</option>
                                </select>
                            </div>

                            <div className="flex gap-4">
                                <motion.button
                                    onClick={handleRunSimulation}
                                    disabled={isSimulating}
                                    className={`flex-[2] py-4 rounded-xl font-bold text-white shadow-lg shadow-violet-500/30 flex items-center justify-center gap-2 transition-all
                                        ${isSimulating
                                            ? 'bg-white/10 cursor-not-allowed shadow-none'
                                            : 'bg-gradient-to-br from-violet-600 to-indigo-600 hover:shadow-violet-500/50'
                                        }`}
                                    whileHover={!isSimulating ? { scale: 1.02 } : {}}
                                    whileTap={!isSimulating ? { scale: 0.98 } : {}}
                                >
                                    {isSimulating ? (
                                        <>
                                            <Loader className="w-5 h-5 animate-spin" />
                                            Simulating...
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-5 h-5 fill-current" />
                                            Preview Impact
                                        </>
                                    )}
                                </motion.button>
                                <motion.button
                                    onClick={handleReset}
                                    className="flex-1 py-4 rounded-xl bg-white/5 border border-white/10 text-gray-400 font-semibold hover:bg-white/10 transition-colors flex items-center justify-center"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <RotateCcw className="w-5 h-5" />
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Results / Visualizer */}
                    <div>
                        <AnimatePresence mode="wait">
                            {isSimulating ? (
                                <motion.div
                                    key="loading"
                                    className="glass-card flex flex-col items-center justify-center p-12 text-center h-full min-h-[500px] relative overflow-hidden"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <canvas
                                        ref={canvasRef}
                                        className="absolute inset-0 w-full h-full pointer-events-none"
                                    />
                                    <div className="relative z-10">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                            className="w-16 h-16 border-4 border-violet-500/20 border-t-violet-500 rounded-full mx-auto mb-6"
                                        />
                                        <h3 className="text-xl font-bold text-white mb-2">Running Simulation</h3>
                                        <p className="text-gray-400">Analyzing impact on project health and risk levels...</p>
                                    </div>
                                </motion.div>
                            ) : results ? (
                                <motion.div
                                    key="results"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-6"
                                >
                                    <motion.div className="glass-card p-6">
                                        <h3 className="text-lg font-bold text-white mb-6">Impact Analysis</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10">
                                                <p className="text-xs font-bold text-emerald-400 mb-3 uppercase">Before</p>
                                                <div className="flex items-end gap-2 mb-2">
                                                    <span className="text-4xl font-bold text-emerald-400">{results.before.healthScore}%</span>
                                                </div>
                                                <p className="text-xs text-emerald-300 opacity-80">Risk: {results.before.riskLevel}</p>
                                            </div>

                                            <div
                                                className="p-5 rounded-xl border"
                                                style={{
                                                    background: `${getHealthColor(results.after.status)}15`,
                                                    borderColor: `${getHealthColor(results.after.status)}40`,
                                                }}
                                            >
                                                <p
                                                    className="text-xs font-bold mb-3 uppercase"
                                                    style={{ color: getHealthColor(results.after.status) }}
                                                >
                                                    After
                                                </p>
                                                <div className="flex items-end gap-2 mb-2">
                                                    <TrendingDown className="w-6 h-6 mb-1" style={{ color: getHealthColor(results.after.status) }} />
                                                    <motion.span
                                                        className="text-4xl font-bold"
                                                        style={{ color: getHealthColor(results.after.status) }}
                                                        initial={{ opacity: 0, scale: 0.5 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                                                    >
                                                        {results.after.healthScore}%
                                                    </motion.span>
                                                </div>
                                                <p
                                                    className="text-xs opacity-80"
                                                    style={{ color: getHealthColor(results.after.status) }}
                                                >
                                                    Risk: {results.after.riskLevel}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        className="glass-card p-6 border border-violet-500/50 bg-gradient-to-br from-violet-500/10 to-indigo-500/10"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <div className="flex items-center gap-3 mb-4">
                                            <Sparkles className="w-5 h-5 text-violet-400" />
                                            <h3 className="font-bold text-violet-400">AI Insight</h3>
                                            <span className="ml-auto text-xs font-bold text-violet-500 py-1 px-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
                                                {results.confidence}% Confidence
                                            </span>
                                        </div>
                                        <p className="text-gray-300 leading-relaxed text-sm">
                                            {results.aiInsight}
                                        </p>
                                    </motion.div>

                                    <motion.button
                                        onClick={handleSaveScenario}
                                        className="w-full py-4 rounded-xl bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 font-semibold hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Save className="w-5 h-5" />
                                        Save Scenario for Comparison
                                    </motion.button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    className="glass-card flex flex-col items-center justify-center p-12 text-center h-full min-h-[400px]"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <Zap className="w-16 h-16 text-violet-500/50 mb-6" />
                                    <h3 className="text-xl font-bold text-white mb-2">Ready to Simulate</h3>
                                    <p className="text-gray-400 max-w-xs mx-auto">
                                        Configure your scenario parameters and click "Preview Impact" to see the projected results
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Saved Scenarios */}
                {savedScenarios.length > 0 && (
                    <motion.div
                        className="mt-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h3 className="text-xl font-bold text-white mb-6">
                            Saved Scenarios <span className="text-gray-500 font-normal">({savedScenarios.length})</span>
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {savedScenarios.map((saved) => (
                                <motion.div
                                    key={saved.id}
                                    className="glass-card p-5 hover:border-violet-500/30 transition-colors"
                                    whileHover={{ scale: 1.02, y: -4 }}
                                >
                                    <p className="text-xs text-gray-500 mb-3">{saved.timestamp}</p>
                                    <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                                        {saved.scenarioType === 'environmental' ? '🌍' : '⚡'}
                                        <span className="capitalize">{saved.scenario.replace(/_/g, ' ')}</span>
                                    </h4>
                                    <div className="flex justify-between items-center text-sm p-3 rounded-lg bg-white/5">
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <span>{saved.results.before.healthScore}%</span>
                                            <span className="text-gray-600">→</span>
                                            <span
                                                className="font-bold"
                                                style={{ color: getHealthColor(saved.results.after.status) }}
                                            >
                                                {saved.results.after.healthScore}%
                                            </span>
                                        </div>
                                        <span className="text-xs font-bold uppercase px-2 py-1 rounded bg-white/5 text-gray-300">
                                            {saved.severity}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </DashboardLayout>
    );
}