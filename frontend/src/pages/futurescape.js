import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import dynamic from 'next/dynamic';
import { projects as projectApi } from '../utils/api';
import {
    Layers,
    MapPin,
    Calendar,
    TreePine,
    Sparkles,
    TrendingUp,
    Droplets,
    Wind,
} from 'lucide-react';

const SatelliteMap = dynamic(() => import('../components/SatelliteMap'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gradient-to-br from-[#0a192f] to-[#0f4c3a] rounded-xl animate-pulse" />,
});

export default function FutureScape() {
    const [selectedArea, setSelectedArea] = useState('nagpur');
    const [timeHorizon, setTimeHorizon] = useState(2);
    const [scenarioATrees, setScenarioATrees] = useState(500);
    const [scenarioBTrees, setScenarioBTrees] = useState(1000);
    const [showResults, setShowResults] = useState(false);
    const [activeScenario, setActiveScenario] = useState('A');
    const canvasRef = useRef(null);
    const [customAreas, setCustomAreas] = useState([]);

    const defaultAreas = [
        { id: 'nagpur', name: 'Nagpur Outskirts', lat: 21.1458, lng: 79.0882 },
        { id: 'amazon', name: 'Amazon Basin', lat: -3.4653, lng: -62.2159 },
        { id: 'reef', name: 'Great Barrier Reef', lat: -18.2871, lng: 147.6992 },
    ];

    const areas = [...defaultAreas, ...customAreas];

    const timeOptions = [1, 2, 5];

    useEffect(() => {
        fetchUserProjects();
    }, []);

    const fetchUserProjects = async () => {
        try {
            const res = await projectApi.getAll();
            if (res.data?.data) {
                const projectAreas = res.data.data.map(p => ({
                    id: p._id || p.id,
                    name: p.name,
                    lat: p.location?.lat || 0,
                    lng: p.location?.lng || 0
                })).filter(p => p.lat !== 0 && p.lng !== 0);
                setCustomAreas(projectAreas);
            }
        } catch (error) {
            console.error("Failed to fetch projects for FutureScape", error);
        }
    };

    // Calculate impact based on tree count and time
    const calculateImpact = (treeCount, years) => {
        const baseImpact = treeCount / 500; // Normalize to 500 trees
        const timeMultiplier = 1 + (years * 0.2); // 20% increase per year
        const totalImpact = baseImpact * timeMultiplier;

        if (totalImpact < 1.2) {
            return {
                vegetation: 'Moderate improvement in vegetation cover',
                heatReduction: 'Partial reduction in heat stress',
                soilStabilization: 'Medium soil stabilization',
                coverageIntensity: 0.3,
                risk: 'Moderate',
            };
        } else if (totalImpact < 2) {
            return {
                vegetation: 'Strong vegetation density',
                heatReduction: 'Significant heat mitigation',
                soilStabilization: 'High soil stabilization',
                moistureRetention: 'Improved moisture retention',
                coverageIntensity: 0.6,
                risk: 'Reduced',
            };
        } else {
            return {
                vegetation: 'Dense canopy formation',
                heatReduction: 'Major heat stress reduction',
                soilStabilization: 'Excellent soil binding',
                moistureRetention: 'Superior water retention',
                biodiversity: 'Higher biodiversity support',
                resilience: 'Enhanced ecosystem resilience',
                coverageIntensity: 0.9,
                risk: 'Minimal',
            };
        }
    };

    const scenarioAImpact = calculateImpact(scenarioATrees, timeHorizon);
    const scenarioBImpact = calculateImpact(scenarioBTrees, timeHorizon);

    // Particle animation for background
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
        const colors = ['rgba(16, 185, 129, 0.3)', 'rgba(34, 211, 238, 0.3)'];

        for (let i = 0; i < 30; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 2 + 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
            });
        }

        const animate = () => {
            // Use clearRect for transparency if needed, or fill with low alpha background
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p) => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();

                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            });

            requestAnimationFrame(animate);
        };

        animate();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleViewImpact = () => {
        setShowResults(true);
    };

    return (
        <DashboardLayout activePage="futurescape">
            <canvas
                ref={canvasRef}
                className="fixed inset-0 w-full h-full pointer-events-none z-0"
            />

            <div className="relative z-10 h-[calc(100vh-60px)] overflow-auto p-8">
                {/* Header */}
                <motion.div
                    className="flex items-center gap-4 mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                        <Layers className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1">
                            FutureScape
                        </h1>
                        <p className="text-base text-gray-400">
                            Compare plantation scenarios and visualize environmental impact
                        </p>
                    </div>
                </motion.div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 mb-8">
                    {/* Control Panel */}
                    <motion.div
                        className="glass-card p-8 h-fit"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <h2 className="text-xl font-semibold text-white mb-6">
                            Scenario Configuration
                        </h2>

                        {/* Area Selection */}
                        <div className="mb-6">
                            <label className="flex items-center gap-2 text-sm font-medium text-emerald-500 mb-3">
                                <MapPin className="w-4 h-4" />
                                Select Area
                            </label>
                            <select
                                value={selectedArea}
                                onChange={(e) => setSelectedArea(e.target.value)}
                                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
                            >
                                {areas.map((area) => (
                                    <option key={area.id} value={area.id} className="bg-[#0a192f] text-gray-300">
                                        {area.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Time Horizon */}
                        <div className="mb-6">
                            <label className="flex items-center gap-2 text-sm font-medium text-emerald-500 mb-3">
                                <Calendar className="w-4 h-4" />
                                Time Horizon
                            </label>
                            <div className="flex gap-3">
                                {timeOptions.map((years) => (
                                    <motion.button
                                        key={years}
                                        onClick={() => setTimeHorizon(years)}
                                        className={`flex-1 p-3 rounded-xl font-semibold text-sm transition-all border
                                            ${timeHorizon === years
                                                ? 'bg-gradient-to-br from-emerald-500 to-green-400 border-transparent text-white shadow-lg shadow-emerald-500/30'
                                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                            }`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {years} {years === 1 ? 'Year' : 'Years'}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Scenario A */}
                        <div className="mb-6 p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                            <label className="flex items-center gap-2 text-base font-semibold text-emerald-500 mb-3">
                                <TreePine className="w-4 h-4" />
                                Scenario A
                            </label>
                            <input
                                type="number"
                                value={scenarioATrees}
                                onChange={(e) => setScenarioATrees(parseInt(e.target.value) || 0)}
                                min="0"
                                step="50"
                                className="w-full p-3 rounded-xl bg-white/5 border border-emerald-500/50 text-white font-semibold text-lg focus:outline-none focus:border-emerald-500"
                            />
                            <p className="text-xs text-gray-400 mt-2">
                                Number of trees to plant
                            </p>
                        </div>

                        {/* Scenario B */}
                        <div className="mb-8 p-5 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                            <label className="flex items-center gap-2 text-base font-semibold text-cyan-400 mb-3">
                                <TreePine className="w-4 h-4" />
                                Scenario B
                            </label>
                            <input
                                type="number"
                                value={scenarioBTrees}
                                onChange={(e) => setScenarioBTrees(parseInt(e.target.value) || 0)}
                                min="0"
                                step="50"
                                className="w-full p-3 rounded-xl bg-white/5 border border-cyan-500/50 text-white font-semibold text-lg focus:outline-none focus:border-cyan-500"
                            />
                            <p className="text-xs text-gray-400 mt-2">
                                Number of trees to plant
                            </p>
                        </div>

                        {/* View Impact Button */}
                        <motion.button
                            onClick={handleViewImpact}
                            className="w-full py-4 rounded-xl bg-gradient-to-br from-emerald-500 to-green-400 text-white font-semibold shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
                            whileHover={{
                                scale: 1.02,
                                boxShadow: '0 12px 36px rgba(16, 185, 129, 0.6)',
                            }}
                            whileTap={{ scale: 0.98 }}
                            animate={!showResults ? { scale: [1, 1.05, 1] } : {}}
                            transition={{ repeat: !showResults ? Infinity : 0, duration: 2 }}
                        >
                            <Sparkles className="w-5 h-5" />
                            View Impact
                        </motion.button>
                    </motion.div>

                    {/* Map Visualization */}
                    <motion.div
                        className="glass-card p-6 min-h-[500px]"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-white">
                                Impact Visualization
                            </h2>

                            {showResults && (
                                <div className="flex gap-2">
                                    <motion.button
                                        onClick={() => setActiveScenario('A')}
                                        className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors
                                            ${activeScenario === 'A'
                                                ? 'bg-gradient-to-br from-emerald-500 to-green-400 border-transparent text-white'
                                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                            }`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Scenario A
                                    </motion.button>
                                    <motion.button
                                        onClick={() => setActiveScenario('B')}
                                        className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors
                                            ${activeScenario === 'B'
                                                ? 'bg-gradient-to-br from-cyan-400 to-cyan-500 border-transparent text-white'
                                                : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                            }`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Scenario B
                                    </motion.button>
                                </div>
                            )}
                        </div>

                        {/* Satellite Map */}
                        <div className="relative w-full h-[500px] rounded-xl overflow-hidden">
                            {showResults ? (
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeScenario}
                                        className="w-full h-full"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <SatelliteMap
                                            area={areas.find(a => a.id === selectedArea)}
                                            coverageIntensity={activeScenario === 'A' ? scenarioAImpact.coverageIntensity : scenarioBImpact.coverageIntensity}
                                            scenarioColor={activeScenario === 'A' ? '#10b981' : '#22d3ee'}
                                        />
                                    </motion.div>
                                </AnimatePresence>
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-[#0a192f] to-[#0f4c3a] flex items-center justify-center rounded-xl">
                                    <div className="text-center text-gray-400">
                                        <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p className="text-lg">
                                            Configure scenarios and click "View Impact" to visualize
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Risk indicator */}
                            {showResults && (
                                <motion.div
                                    className="absolute top-4 right-4 px-4 py-2 rounded-xl text-white text-sm font-bold shadow-lg z-[1000] backdrop-blur-md"
                                    style={{
                                        background: activeScenario === 'A'
                                            ? 'rgba(16, 185, 129, 0.9)'
                                            : 'rgba(34, 211, 238, 0.9)',
                                    }}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.5, type: 'spring' }}
                                >
                                    Risk: {activeScenario === 'A' ? scenarioAImpact.risk : scenarioBImpact.risk}
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Impact Summary */}
                <AnimatePresence>
                    {showResults && (
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 gap-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            {/* Scenario A Summary */}
                            <motion.div
                                className="glass-card p-8 border-2 border-emerald-500/30"
                                whileHover={{ scale: 1.02 }}
                            >
                                <h3 className="text-xl font-bold text-emerald-500 mb-2 flex items-center gap-2">
                                    <TreePine className="w-5 h-5" />
                                    Scenario A ({scenarioATrees} trees)
                                </h3>
                                <p className="text-sm text-gray-400 mb-6">
                                    Impact after {timeHorizon} {timeHorizon === 1 ? 'year' : 'years'}
                                </p>

                                <div className="space-y-3">
                                    {Object.entries(scenarioAImpact).map(([key, value]) => {
                                        if (key === 'coverageIntensity' || key === 'risk') return null;
                                        const icons = {
                                            vegetation: TreePine,
                                            heatReduction: Wind,
                                            soilStabilization: TrendingUp,
                                            moistureRetention: Droplets,
                                            biodiversity: Sparkles,
                                            resilience: TrendingUp,
                                        };
                                        const Icon = icons[key];
                                        return (
                                            <div key={key} className="flex items-start gap-3">
                                                {Icon && <Icon className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />}
                                                <p className="text-sm text-gray-300 leading-relaxed">
                                                    {value}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>

                            {/* Scenario B Summary */}
                            <motion.div
                                className="glass-card p-8 border-2 border-cyan-500/30"
                                whileHover={{ scale: 1.02 }}
                            >
                                <h3 className="text-xl font-bold text-cyan-400 mb-2 flex items-center gap-2">
                                    <TreePine className="w-5 h-5" />
                                    Scenario B ({scenarioBTrees} trees)
                                </h3>
                                <p className="text-sm text-gray-400 mb-6">
                                    Impact after {timeHorizon} {timeHorizon === 1 ? 'year' : 'years'}
                                </p>

                                <div className="space-y-3">
                                    {Object.entries(scenarioBImpact).map(([key, value]) => {
                                        if (key === 'coverageIntensity' || key === 'risk') return null;
                                        const icons = {
                                            vegetation: TreePine,
                                            heatReduction: Wind,
                                            soilStabilization: TrendingUp,
                                            moistureRetention: Droplets,
                                            biodiversity: Sparkles,
                                            resilience: TrendingUp,
                                        };
                                        const Icon = icons[key];
                                        return (
                                            <div key={key} className="flex items-start gap-3">
                                                {Icon && <Icon className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />}
                                                <p className="text-sm text-gray-300 leading-relaxed">
                                                    {value}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
}
