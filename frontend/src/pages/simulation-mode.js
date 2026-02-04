import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { FlaskConical, Play, RotateCcw, Settings } from 'lucide-react';

export default function SimulationMode() {
    const [isRunning, setIsRunning] = useState(false);

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <motion.h1
                        className="text-3xl font-bold text-text-primary"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        Simulation Mode
                    </motion.h1>
                    <div className="flex gap-3">
                        <motion.button
                            className="btn btn-secondary flex items-center gap-2"
                            whileHover={{ scale: 1.02 }}
                        >
                            <Settings className="w-4 h-4" />
                            Configure
                        </motion.button>
                        <motion.button
                            className="btn btn-secondary flex items-center gap-2"
                            whileHover={{ scale: 1.02 }}
                        >
                            <RotateCcw className="w-4 h-4" />
                            Reset
                        </motion.button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="card h-[500px] flex items-center justify-center">
                            <div className="text-center">
                                <FlaskConical className="w-24 h-24 text-accent-green mx-auto mb-4" />
                                <h3 className="text-2xl font-semibold text-text-primary mb-2">
                                    Climate Impact Simulation
                                </h3>
                                <p className="text-text-secondary mb-6">
                                    Model the effects of climate change on forest health
                                </p>
                                <motion.button
                                    className="btn btn-primary flex items-center gap-2 mx-auto"
                                    onClick={() => setIsRunning(!isRunning)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Play className="w-5 h-5" />
                                    {isRunning ? 'Stop Simulation' : 'Start Simulation'}
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="card">
                            <h3 className="text-lg font-semibold text-text-primary mb-4">Simulation Parameters</h3>
                            <div className="space-y-4">
                                {['Temperature Increase', 'Rainfall Change', 'CO2 Levels', 'Deforestation Rate'].map((param) => (
                                    <div key={param}>
                                        <label className="text-sm text-text-secondary mb-2 block">{param}</label>
                                        <input
                                            type="range"
                                            className="w-full accent-accent-green"
                                            min="0"
                                            max="100"
                                            defaultValue="50"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card">
                            <h3 className="text-lg font-semibold text-text-primary mb-3">Results</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Forest Coverage:</span>
                                    <span className="text-accent-green font-semibold">-12%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Biodiversity:</span>
                                    <span className="text-accent-orange font-semibold">-8%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Carbon Storage:</span>
                                    <span className="text-accent-red font-semibold">-15%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
