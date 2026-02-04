import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Layout from '../components/Layout';
import { MapPin, Filter, Search } from 'lucide-react';

const AnimatedGlobe = dynamic(() => import('../components/AnimatedGlobe'), {
    ssr: false,
});

export default function MapView() {
    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <motion.h1
                        className="text-3xl font-bold text-text-primary"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        Interactive Map View
                    </motion.h1>
                    <div className="flex gap-3">
                        <motion.button
                            className="btn btn-secondary flex items-center gap-2"
                            whileHover={{ scale: 1.02 }}
                        >
                            <Filter className="w-4 h-4" />
                            Filter
                        </motion.button>
                        <motion.button
                            className="btn btn-secondary flex items-center gap-2"
                            whileHover={{ scale: 1.02 }}
                        >
                            <Search className="w-4 h-4" />
                            Search
                        </motion.button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 h-[600px] glass">
                        <AnimatedGlobe />
                    </div>
                    <div className="space-y-4">
                        <div className="glass p-4">
                            <h3 className="text-lg font-semibold text-text-primary mb-3">Active Locations</h3>
                            {['Pune Zone', 'Nashik Zone', 'Nagpur Zone', 'Delhi Region'].map((location, i) => (
                                <motion.div
                                    key={location}
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-forest-dark cursor-pointer transition-colors mb-2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <MapPin className="w-5 h-5 text-accent-orange" />
                                    <span className="text-text-primary">{location}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
