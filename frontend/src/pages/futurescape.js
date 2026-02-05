import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import dynamic from 'next/dynamic';
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
    loading: () => <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #0a192f, #0f4c3a)', borderRadius: '12px' }} />,
});

export default function FutureScape() {
    const [selectedArea, setSelectedArea] = useState('nagpur');
    const [timeHorizon, setTimeHorizon] = useState(2);
    const [scenarioATrees, setScenarioATrees] = useState(500);
    const [scenarioBTrees, setScenarioBTrees] = useState(1000);
    const [showResults, setShowResults] = useState(false);
    const [activeScenario, setActiveScenario] = useState('A');
    const canvasRef = useRef(null);

    const areas = [
        { id: 'nagpur', name: 'Nagpur Outskirts', lat: 21.1458, lng: 79.0882 },
        { id: 'amazon', name: 'Amazon Basin', lat: -3.4653, lng: -62.2159 },
        { id: 'reef', name: 'Great Barrier Reef', lat: -18.2871, lng: 147.6992 },
    ];

    const timeOptions = [1, 2, 5];

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
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

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
    }, []);

    const handleViewImpact = () => {
        setShowResults(true);
    };

    return (
        <DashboardLayout activePage="futurescape">
            <canvas
                ref={canvasRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 0,
                    pointerEvents: 'none',
                }}
            />

            <div style={{
                height: 'calc(100vh - 60px)',
                overflow: 'auto',
                padding: '2rem',
                position: 'relative',
                zIndex: 1,
            }}>
                {/* Header */}
                <motion.div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        marginBottom: '2rem',
                    }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '14px',
                        background: 'linear-gradient(135deg, var(--emerald-green), var(--bright-green))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
                    }}>
                        <Layers style={{ width: '28px', height: '28px', color: '#ffffff' }} />
                    </div>
                    <div>
                        <h1 style={{
                            fontSize: '2rem',
                            fontWeight: '700',
                            color: 'var(--text-primary)',
                            marginBottom: '0.25rem',
                        }}>
                            FutureScape
                        </h1>
                        <p style={{
                            fontSize: '1rem',
                            color: 'var(--text-secondary)',
                        }}>
                            Compare plantation scenarios and visualize environmental impact
                        </p>
                    </div>
                </motion.div>

                {/* Main Content */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '400px 1fr',
                    gap: '2rem',
                    marginBottom: '2rem',
                }}>
                    {/* Control Panel */}
                    <motion.div
                        className="glass-card"
                        style={{
                            padding: '2rem',
                            height: 'fit-content',
                        }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <h2 style={{
                            fontSize: '1.25rem',
                            fontWeight: '600',
                            color: 'var(--text-primary)',
                            marginBottom: '1.5rem',
                        }}>
                            Scenario Configuration
                        </h2>

                        {/* Area Selection */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '0.9375rem',
                                color: 'var(--emerald-green)',
                                marginBottom: '0.75rem',
                                fontWeight: '500',
                            }}>
                                <MapPin style={{ width: '16px', height: '16px' }} />
                                Select Area
                            </label>
                            <select
                                value={selectedArea}
                                onChange={(e) => setSelectedArea(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '10px',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.9375rem',
                                    outline: 'none',
                                    cursor: 'pointer',
                                }}
                            >
                                {areas.map((area) => (
                                    <option key={area.id} value={area.id} style={{ background: '#0a192f' }}>
                                        {area.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Time Horizon */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '0.9375rem',
                                color: 'var(--emerald-green)',
                                marginBottom: '0.75rem',
                                fontWeight: '500',
                            }}>
                                <Calendar style={{ width: '16px', height: '16px' }} />
                                Time Horizon
                            </label>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                {timeOptions.map((years) => (
                                    <motion.button
                                        key={years}
                                        onClick={() => setTimeHorizon(years)}
                                        style={{
                                            flex: 1,
                                            padding: '0.75rem',
                                            background: timeHorizon === years
                                                ? 'linear-gradient(135deg, var(--emerald-green), var(--bright-green))'
                                                : 'rgba(255, 255, 255, 0.05)',
                                            border: `1px solid ${timeHorizon === years ? 'var(--emerald-green)' : 'var(--glass-border)'}`,
                                            borderRadius: '10px',
                                            color: timeHorizon === years ? '#ffffff' : 'var(--text-secondary)',
                                            fontSize: '0.9375rem',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                        }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {years} {years === 1 ? 'Year' : 'Years'}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Scenario A */}
                        <div style={{
                            marginBottom: '1.5rem',
                            padding: '1.25rem',
                            background: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            borderRadius: '12px',
                        }}>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '1rem',
                                color: 'var(--emerald-green)',
                                marginBottom: '0.75rem',
                                fontWeight: '600',
                            }}>
                                <TreePine style={{ width: '18px', height: '18px' }} />
                                Scenario A
                            </label>
                            <input
                                type="number"
                                value={scenarioATrees}
                                onChange={(e) => setScenarioATrees(parseInt(e.target.value) || 0)}
                                min="0"
                                step="50"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '10px',
                                    color: 'var(--text-primary)',
                                    fontSize: '1.125rem',
                                    fontWeight: '600',
                                    outline: 'none',
                                }}
                            />
                            <p style={{
                                fontSize: '0.8125rem',
                                color: 'var(--text-muted)',
                                marginTop: '0.5rem',
                            }}>
                                Number of trees to plant
                            </p>
                        </div>

                        {/* Scenario B */}
                        <div style={{
                            marginBottom: '2rem',
                            padding: '1.25rem',
                            background: 'rgba(34, 211, 238, 0.1)',
                            border: '1px solid rgba(34, 211, 238, 0.3)',
                            borderRadius: '12px',
                        }}>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '1rem',
                                color: '#22d3ee',
                                marginBottom: '0.75rem',
                                fontWeight: '600',
                            }}>
                                <TreePine style={{ width: '18px', height: '18px' }} />
                                Scenario B
                            </label>
                            <input
                                type="number"
                                value={scenarioBTrees}
                                onChange={(e) => setScenarioBTrees(parseInt(e.target.value) || 0)}
                                min="0"
                                step="50"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '10px',
                                    color: 'var(--text-primary)',
                                    fontSize: '1.125rem',
                                    fontWeight: '600',
                                    outline: 'none',
                                }}
                            />
                            <p style={{
                                fontSize: '0.8125rem',
                                color: 'var(--text-muted)',
                                marginTop: '0.5rem',
                            }}>
                                Number of trees to plant
                            </p>
                        </div>

                        {/* View Impact Button */}
                        <motion.button
                            onClick={handleViewImpact}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: 'linear-gradient(135deg, var(--emerald-green), var(--bright-green))',
                                border: 'none',
                                borderRadius: '12px',
                                color: '#ffffff',
                                fontSize: '1.0625rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                            }}
                            whileHover={{
                                scale: 1.02,
                                boxShadow: '0 12px 36px rgba(16, 185, 129, 0.6)',
                            }}
                            whileTap={{ scale: 0.98 }}
                            animate={!showResults ? { scale: [1, 1.05, 1] } : {}}
                            transition={{ repeat: !showResults ? Infinity : 0, duration: 2 }}
                        >
                            <Sparkles style={{ width: '20px', height: '20px' }} />
                            View Impact
                        </motion.button>
                    </motion.div>

                    {/* Map Visualization */}
                    <motion.div
                        className="glass-card"
                        style={{
                            padding: '1.5rem',
                            position: 'relative',
                            minHeight: '500px',
                        }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '1.5rem',
                        }}>
                            <h2 style={{
                                fontSize: '1.25rem',
                                fontWeight: '600',
                                color: 'var(--text-primary)',
                            }}>
                                Impact Visualization
                            </h2>

                            {showResults && (
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <motion.button
                                        onClick={() => setActiveScenario('A')}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            background: activeScenario === 'A'
                                                ? 'linear-gradient(135deg, var(--emerald-green), var(--bright-green))'
                                                : 'rgba(255, 255, 255, 0.05)',
                                            border: `1px solid ${activeScenario === 'A' ? 'var(--emerald-green)' : 'var(--glass-border)'}`,
                                            borderRadius: '8px',
                                            color: activeScenario === 'A' ? '#ffffff' : 'var(--text-secondary)',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                        }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Scenario A
                                    </motion.button>
                                    <motion.button
                                        onClick={() => setActiveScenario('B')}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            background: activeScenario === 'B'
                                                ? 'linear-gradient(135deg, #22d3ee, #06b6d4)'
                                                : 'rgba(255, 255, 255, 0.05)',
                                            border: `1px solid ${activeScenario === 'B' ? '#22d3ee' : 'var(--glass-border)'}`,
                                            borderRadius: '8px',
                                            color: activeScenario === 'B' ? '#ffffff' : 'var(--text-secondary)',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                        }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Scenario B
                                    </motion.button>
                                </div>
                            )}
                        </div>

                        {/* Satellite Map */}
                        <div style={{
                            position: 'relative',
                            width: '100%',
                            height: '500px',
                            borderRadius: '12px',
                            overflow: 'hidden',
                        }}>
                            {showResults ? (
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeScenario}
                                        style={{ width: '100%', height: '100%' }}
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
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    background: 'linear-gradient(135deg, #0a192f, #0f4c3a)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '12px',
                                }}>
                                    <div style={{
                                        textAlign: 'center',
                                        color: 'var(--text-muted)',
                                    }}>
                                        <MapPin style={{ width: '48px', height: '48px', margin: '0 auto 1rem' }} />
                                        <p style={{ fontSize: '1rem' }}>
                                            Configure scenarios and click "View Impact" to visualize
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Risk indicator */}
                            {showResults && (
                                <motion.div
                                    style={{
                                        position: 'absolute',
                                        top: '1rem',
                                        right: '1rem',
                                        padding: '0.5rem 1rem',
                                        background: activeScenario === 'A'
                                            ? 'rgba(16, 185, 129, 0.9)'
                                            : 'rgba(34, 211, 238, 0.9)',
                                        borderRadius: '8px',
                                        color: '#ffffff',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                                        zIndex: 1000,
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
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '2rem',
                            }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            {/* Scenario A Summary */}
                            <motion.div
                                className="glass-card"
                                style={{
                                    padding: '2rem',
                                    border: '2px solid rgba(16, 185, 129, 0.3)',
                                }}
                                whileHover={{ scale: 1.02 }}
                            >
                                <h3 style={{
                                    fontSize: '1.25rem',
                                    fontWeight: '600',
                                    color: 'var(--emerald-green)',
                                    marginBottom: '0.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                }}>
                                    <TreePine style={{ width: '20px', height: '20px' }} />
                                    Scenario A ({scenarioATrees} trees)
                                </h3>
                                <p style={{
                                    fontSize: '0.875rem',
                                    color: 'var(--text-muted)',
                                    marginBottom: '1.5rem',
                                }}>
                                    Impact after {timeHorizon} {timeHorizon === 1 ? 'year' : 'years'}
                                </p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
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
                                            <div
                                                key={key}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'start',
                                                    gap: '0.75rem',
                                                }}
                                            >
                                                {Icon && <Icon style={{ width: '16px', height: '16px', color: 'var(--emerald-green)', marginTop: '0.25rem', flexShrink: 0 }} />}
                                                <p style={{
                                                    fontSize: '0.9375rem',
                                                    color: 'var(--text-secondary)',
                                                    lineHeight: '1.6',
                                                }}>
                                                    {value}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>

                            {/* Scenario B Summary */}
                            <motion.div
                                className="glass-card"
                                style={{
                                    padding: '2rem',
                                    border: '2px solid rgba(34, 211, 238, 0.3)',
                                }}
                                whileHover={{ scale: 1.02 }}
                            >
                                <h3 style={{
                                    fontSize: '1.25rem',
                                    fontWeight: '600',
                                    color: '#22d3ee',
                                    marginBottom: '0.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                }}>
                                    <TreePine style={{ width: '20px', height: '20px' }} />
                                    Scenario B ({scenarioBTrees} trees)
                                </h3>
                                <p style={{
                                    fontSize: '0.875rem',
                                    color: 'var(--text-muted)',
                                    marginBottom: '1.5rem',
                                }}>
                                    Impact after {timeHorizon} {timeHorizon === 1 ? 'year' : 'years'}
                                </p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
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
                                            <div
                                                key={key}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'start',
                                                    gap: '0.75rem',
                                                }}
                                            >
                                                {Icon && <Icon style={{ width: '16px', height: '16px', color: '#22d3ee', marginTop: '0.25rem', flexShrink: 0 }} />}
                                                <p style={{
                                                    fontSize: '0.9375rem',
                                                    color: 'var(--text-secondary)',
                                                    lineHeight: '1.6',
                                                }}>
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
