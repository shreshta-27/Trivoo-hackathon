import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
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
} from 'lucide-react';

export default function SimulationMode() {
    const router = useRouter();
    const [view, setView] = useState('selection'); // 'selection' or 'sandbox'
    const [selectedProject, setSelectedProject] = useState(null);
    const [scenarioType, setScenarioType] = useState('environmental');
    const [scenario, setScenario] = useState('drought');
    const [duration, setDuration] = useState(30);
    const [severity, setSeverity] = useState('medium');
    const [isSimulating, setIsSimulating] = useState(false);
    const [results, setResults] = useState(null);
    const [savedScenarios, setSavedScenarios] = useState([]);
    const canvasRef = useRef(null);

    // Mock projects data
    const projects = [
        {
            id: 1,
            name: 'Amazon Reforestation Initiative',
            region: 'Amazon Rainforest',
            treesPlanted: 15000,
            health: 'healthy',
            healthScore: 92,
        },
        {
            id: 2,
            name: 'Coral Restoration Project',
            region: 'Great Barrier Reef',
            treesPlanted: 5000,
            health: 'warning',
            healthScore: 68,
        },
        {
            id: 3,
            name: 'Arctic Biodiversity Conservation',
            region: 'Arctic Circle',
            treesPlanted: 3000,
            health: 'critical',
            healthScore: 45,
        },
        {
            id: 4,
            name: 'Congo Basin Forest Protection',
            region: 'Congo Basin',
            treesPlanted: 12000,
            health: 'healthy',
            healthScore: 88,
        },
    ];

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

    // Three.js particle animation
    useEffect(() => {
        if (!canvasRef.current || !isSimulating) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

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

        return () => cancelAnimationFrame(animationId);
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

        setTimeout(() => {
            const impact = getSeverityImpact();
            const newHealthScore = Math.max(10, selectedProject.healthScore - impact.healthDrop);

            setResults({
                before: {
                    healthScore: selectedProject.healthScore,
                    riskLevel: 'Low',
                    status: selectedProject.health,
                },
                after: {
                    healthScore: newHealthScore,
                    riskLevel: severity === 'critical' ? 'Critical' : severity === 'high' ? 'High' : 'Medium',
                    status: newHealthScore > 70 ? 'warning' : 'critical',
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
                confidence: 87,
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
    const currentScenarioData = currentScenarios.find((s) => s.id === scenario) || currentScenarios[0];

    if (view === 'selection') {
        return (
            <DashboardLayout activePage="simulation-mode">
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
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
                                    background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                            >
                                <Zap style={{ width: '28px', height: '28px', color: '#fff' }} />
                            </motion.div>
                            <h1
                                style={{
                                    fontSize: '2.5rem',
                                    fontWeight: '700',
                                    background: 'linear-gradient(135deg, var(--text-primary), #8b5cf6)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                Decision Sandbox
                            </h1>
                        </div>
                        <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', marginLeft: '72px' }}>
                            Test environmental scenarios and decisions without affecting real project data
                        </p>
                    </motion.div>

                    {/* Project Selection Grid */}
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                            gap: '1.5rem',
                        }}
                    >
                        {projects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                className="glass-card"
                                style={{
                                    padding: '1.75rem',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}
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
                                <h3
                                    style={{
                                        fontSize: '1.25rem',
                                        fontWeight: '600',
                                        color: 'var(--text-primary)',
                                        marginBottom: '1rem',
                                    }}
                                >
                                    {project.name}
                                </h3>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                    <MapPin style={{ width: '16px', height: '16px', color: '#8b5cf6' }} />
                                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{project.region}</span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                    <TreePine style={{ width: '16px', height: '16px', color: '#8b5cf6' }} />
                                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                        {project.treesPlanted.toLocaleString()} trees
                                    </span>
                                </div>

                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '1rem',
                                        borderRadius: '10px',
                                        background: `${getHealthColor(project.health)}15`,
                                        border: `1px solid ${getHealthColor(project.health)}40`,
                                    }}
                                >
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                                        Current Health
                                    </span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <TrendingUp style={{ width: '16px', height: '16px', color: getHealthColor(project.health) }} />
                                        <span
                                            style={{
                                                fontSize: '1.5rem',
                                                fontWeight: '700',
                                                color: getHealthColor(project.health),
                                            }}
                                        >
                                            {project.healthScore}%
                                        </span>
                                    </div>
                                </div>

                                <motion.div
                                    style={{
                                        position: 'absolute',
                                        bottom: '1.25rem',
                                        right: '1.5rem',
                                        fontSize: '0.8rem',
                                        color: '#8b5cf6',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                    }}
                                    initial={{ opacity: 0.6 }}
                                    whileHover={{ opacity: 1, x: 4 }}
                                >
                                    Enter Sandbox
                                    <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                                        →
                                    </motion.span>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // Sandbox View
    return (
        <DashboardLayout activePage="simulation-mode">
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {/* Back Button */}
                <motion.button
                    onClick={handleExitSandbox}
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
                        marginBottom: '1.5rem',
                    }}
                    whileHover={{ scale: 1.02, background: 'rgba(255, 255, 255, 0.15)' }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <ArrowLeft style={{ width: '16px', height: '16px' }} />
                    Exit Sandbox
                </motion.button>

                {/* Simulation Warning Banner */}
                <motion.div
                    style={{
                        padding: '1rem 1.5rem',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(99, 102, 241, 0.1))',
                        border: '2px solid #8b5cf6',
                        marginBottom: '2rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                    }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Info style={{ width: '24px', height: '24px', color: '#8b5cf6', flexShrink: 0 }} />
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: '500', margin: 0 }}>
                        🔬 <strong>This is a simulation.</strong> Real project data will not be changed. Test scenarios freely to
                        understand potential impacts.
                    </p>
                </motion.div>

                {/* Project Summary Header */}
                <motion.div
                    className="glass-card"
                    style={{ padding: '1.5rem', marginBottom: '2rem' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                                {selectedProject.name}
                            </h2>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <MapPin style={{ width: '14px', height: '14px', color: '#8b5cf6' }} />
                                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                        {selectedProject.region}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <TreePine style={{ width: '14px', height: '14px', color: '#8b5cf6' }} />
                                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                        {selectedProject.treesPlanted.toLocaleString()} trees
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div
                            style={{
                                padding: '1rem 1.5rem',
                                borderRadius: '12px',
                                background: `${getHealthColor(selectedProject.health)}20`,
                                border: `2px solid ${getHealthColor(selectedProject.health)}`,
                                textAlign: 'center',
                            }}
                        >
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                                Current Health
                            </p>
                            <p style={{ fontSize: '2rem', fontWeight: '700', color: getHealthColor(selectedProject.health) }}>
                                {selectedProject.healthScore}%
                            </p>
                        </div>
                    </div>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    {/* Left Column: Scenario Configuration */}
                    <div>
                        <motion.div
                            className="glass-card"
                            style={{ padding: '2rem' }}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h3
                                style={{
                                    fontSize: '1.25rem',
                                    fontWeight: '600',
                                    color: 'var(--text-primary)',
                                    marginBottom: '1.5rem',
                                }}
                            >
                                Configure Scenario
                            </h3>

                            {/* Scenario Type Selector */}
                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.75rem', display: 'block' }}>
                                    Scenario Type
                                </label>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    {['environmental', 'action'].map((type) => (
                                        <motion.button
                                            key={type}
                                            onClick={() => {
                                                setScenarioType(type);
                                                setScenario(type === 'environmental' ? 'drought' : 'delay_irrigation');
                                            }}
                                            style={{
                                                flex: 1,
                                                padding: '0.875rem',
                                                borderRadius: '10px',
                                                background: scenarioType === type ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                                border: scenarioType === type ? '2px solid #8b5cf6' : '1px solid var(--glass-border)',
                                                color: scenarioType === type ? '#8b5cf6' : 'var(--text-secondary)',
                                                fontSize: '0.875rem',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                textTransform: 'capitalize',
                                            }}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            {type === 'environmental' ? '🌍 Environmental' : '⚡ Action-Based'}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {/* Scenario Selection */}
                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.75rem', display: 'block' }}>
                                    Select Scenario
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                                    {currentScenarios.map((s) => {
                                        const Icon = s.icon;
                                        return (
                                            <motion.button
                                                key={s.id}
                                                onClick={() => setScenario(s.id)}
                                                style={{
                                                    padding: '1rem',
                                                    borderRadius: '10px',
                                                    background: scenario === s.id ? `${s.color}20` : 'rgba(255, 255, 255, 0.05)',
                                                    border: scenario === s.id ? `2px solid ${s.color}` : '1px solid var(--glass-border)',
                                                    color: 'var(--text-primary)',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                }}
                                                whileHover={{ scale: 1.05, y: -2 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <Icon style={{ width: '24px', height: '24px', color: s.color }} />
                                                <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>{s.name}</span>
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Duration Slider */}
                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.75rem', display: 'block' }}>
                                    Duration: <strong style={{ color: '#8b5cf6' }}>{duration} days</strong>
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="90"
                                    value={duration}
                                    onChange={(e) => setDuration(parseInt(e.target.value))}
                                    style={{
                                        width: '100%',
                                        height: '6px',
                                        borderRadius: '3px',
                                        background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${(duration / 90) * 100}%, rgba(255,255,255,0.1) ${(duration / 90) * 100}%, rgba(255,255,255,0.1) 100%)`,
                                        outline: 'none',
                                        cursor: 'pointer',
                                    }}
                                />
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>1 day</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>90 days</span>
                                </div>
                            </div>

                            {/* Severity Dropdown */}
                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.75rem', display: 'block' }}>
                                    Severity Level
                                </label>
                                <select
                                    value={severity}
                                    onChange={(e) => setSeverity(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.875rem',
                                        borderRadius: '10px',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid var(--glass-border)',
                                        color: 'var(--text-primary)',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <option value="low">Low - Minimal Impact</option>
                                    <option value="medium">Medium - Moderate Impact</option>
                                    <option value="high">High - Significant Impact</option>
                                    <option value="critical">Critical - Severe Impact</option>
                                </select>
                            </div>

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <motion.button
                                    onClick={handleRunSimulation}
                                    disabled={isSimulating}
                                    style={{
                                        flex: 2,
                                        padding: '1rem',
                                        borderRadius: '10px',
                                        background: isSimulating
                                            ? 'rgba(255, 255, 255, 0.1)'
                                            : 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                                        border: 'none',
                                        color: '#ffffff',
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        cursor: isSimulating ? 'not-allowed' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                    }}
                                    whileHover={!isSimulating ? { scale: 1.02 } : {}}
                                    whileTap={!isSimulating ? { scale: 0.98 } : {}}
                                >
                                    <Play style={{ width: '18px', height: '18px' }} />
                                    {isSimulating ? 'Simulating...' : 'Preview Impact'}
                                </motion.button>
                                <motion.button
                                    onClick={handleReset}
                                    style={{
                                        flex: 1,
                                        padding: '1rem',
                                        borderRadius: '10px',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        border: '1px solid var(--glass-border)',
                                        color: 'var(--text-secondary)',
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                    }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <RotateCcw style={{ width: '18px', height: '18px' }} />
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Results */}
                    <div>
                        <AnimatePresence mode="wait">
                            {isSimulating ? (
                                <motion.div
                                    key="loading"
                                    className="glass-card"
                                    style={{
                                        padding: '3rem',
                                        textAlign: 'center',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        minHeight: '400px',
                                    }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <canvas
                                        ref={canvasRef}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            pointerEvents: 'none',
                                        }}
                                    />
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                        style={{
                                            width: '64px',
                                            height: '64px',
                                            border: '4px solid rgba(139, 92, 246, 0.2)',
                                            borderTopColor: '#8b5cf6',
                                            borderRadius: '50%',
                                            margin: '0 auto 1.5rem',
                                        }}
                                    />
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                                        Running Simulation
                                    </h3>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                        Analyzing impact on project health and risk levels...
                                    </p>
                                </motion.div>
                            ) : results ? (
                                <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                    {/* Before/After Comparison */}
                                    <motion.div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                                        <h3
                                            style={{
                                                fontSize: '1.125rem',
                                                fontWeight: '600',
                                                color: 'var(--text-primary)',
                                                marginBottom: '1.5rem',
                                            }}
                                        >
                                            Impact Analysis
                                        </h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            {/* Before */}
                                            <div
                                                style={{
                                                    padding: '1.25rem',
                                                    borderRadius: '10px',
                                                    background: 'rgba(16, 185, 129, 0.1)',
                                                    border: '1px solid rgba(16, 185, 129, 0.3)',
                                                }}
                                            >
                                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                                                    BEFORE
                                                </p>
                                                <motion.p
                                                    style={{ fontSize: '2.5rem', fontWeight: '700', color: '#10b981', marginBottom: '0.5rem' }}
                                                    initial={{ opacity: 0, scale: 0.5 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ type: 'spring', stiffness: 200 }}
                                                >
                                                    {results.before.healthScore}%
                                                </motion.p>
                                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                    Risk: {results.before.riskLevel}
                                                </p>
                                            </div>

                                            {/* After */}
                                            <div
                                                style={{
                                                    padding: '1.25rem',
                                                    borderRadius: '10px',
                                                    background: `${getHealthColor(results.after.status)}15`,
                                                    border: `1px solid ${getHealthColor(results.after.status)}40`,
                                                }}
                                            >
                                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                                                    AFTER
                                                </p>
                                                <motion.div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                    <TrendingDown style={{ width: '20px', height: '20px', color: getHealthColor(results.after.status) }} />
                                                    <motion.p
                                                        style={{
                                                            fontSize: '2.5rem',
                                                            fontWeight: '700',
                                                            color: getHealthColor(results.after.status),
                                                        }}
                                                        initial={{ opacity: 0, scale: 0.5 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                                                    >
                                                        {results.after.healthScore}%
                                                    </motion.p>
                                                </motion.div>
                                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                    Risk: {results.after.riskLevel}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* AI Insight Panel */}
                                    <motion.div
                                        className="glass-card"
                                        style={{
                                            padding: '1.5rem',
                                            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(99, 102, 241, 0.05))',
                                            border: '1px solid #8b5cf6',
                                            marginBottom: '1.5rem',
                                        }}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                            <Sparkles style={{ width: '20px', height: '20px', color: '#8b5cf6' }} />
                                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#8b5cf6' }}>AI Insight</h3>
                                            <span
                                                style={{
                                                    marginLeft: 'auto',
                                                    fontSize: '0.75rem',
                                                    color: '#8b5cf6',
                                                    fontWeight: '600',
                                                }}
                                            >
                                                {results.confidence}% Confidence
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: '1.6' }}>
                                            {results.aiInsight}
                                        </p>
                                    </motion.div>

                                    {/* Save Scenario Button */}
                                    <motion.button
                                        onClick={handleSaveScenario}
                                        style={{
                                            width: '100%',
                                            padding: '1rem',
                                            borderRadius: '10px',
                                            background: 'rgba(16, 185, 129, 0.1)',
                                            border: '1px solid var(--emerald-green)',
                                            color: 'var(--emerald-green)',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                        }}
                                        whileHover={{ scale: 1.02, background: 'rgba(16, 185, 129, 0.15)' }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Save style={{ width: '18px', height: '18px' }} />
                                        Save Scenario for Comparison
                                    </motion.button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    className="glass-card"
                                    style={{
                                        padding: '3rem',
                                        textAlign: 'center',
                                        minHeight: '400px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <Zap style={{ width: '64px', height: '64px', color: '#8b5cf6', marginBottom: '1rem', opacity: 0.5 }} />
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                                        Ready to Simulate
                                    </h3>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '300px' }}>
                                        Configure your scenario parameters and click "Preview Impact" to see the projected results
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Saved Scenarios Comparison */}
                {savedScenarios.length > 0 && (
                    <motion.div
                        style={{ marginTop: '2rem' }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h3
                            style={{
                                fontSize: '1.25rem',
                                fontWeight: '600',
                                color: 'var(--text-primary)',
                                marginBottom: '1rem',
                            }}
                        >
                            Saved Scenarios ({savedScenarios.length})
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                            {savedScenarios.map((saved) => (
                                <motion.div
                                    key={saved.id}
                                    className="glass-card"
                                    style={{ padding: '1.25rem' }}
                                    whileHover={{ scale: 1.02, y: -4 }}
                                >
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                        {saved.timestamp}
                                    </p>
                                    <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                                        {saved.scenario.replace(/_/g, ' ')}
                                    </h4>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                                        <span style={{ color: 'var(--text-secondary)' }}>
                                            {saved.results.before.healthScore}% → {saved.results.after.healthScore}%
                                        </span>
                                        <span
                                            style={{
                                                color: getHealthColor(saved.results.after.status),
                                                fontWeight: '600',
                                            }}
                                        >
                                            {saved.severity.toUpperCase()}
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
