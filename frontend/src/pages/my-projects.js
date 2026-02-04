import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { FolderKanban, Calendar, MapPin, TrendingUp } from 'lucide-react';

const projects = [
    { name: 'Pune Reforestation', location: 'Pune Zone', status: 'Active', progress: 75, risk: 'Medium' },
    { name: 'Nashik Conservation', location: 'Nashik Zone', status: 'Active', progress: 60, risk: 'High' },
    { name: 'Nagpur Wildlife Protection', location: 'Nagpur Zone', status: 'Planning', progress: 30, risk: 'Low' },
    { name: 'Delhi Green Belt', location: 'Delhi Region', status: 'Active', progress: 85, risk: 'Low' },
];

export default function MyProjects() {
    return (
        <Layout>
            <div className="space-y-6">
                <motion.h1
                    className="text-3xl font-bold text-text-primary"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    My Projects
                </motion.h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.name}
                            className="card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-lg bg-accent-green/10">
                                        <FolderKanban className="w-6 h-6 text-accent-green" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-text-primary">{project.name}</h3>
                                        <div className="flex items-center gap-2 text-text-secondary text-sm mt-1">
                                            <MapPin className="w-4 h-4" />
                                            {project.location}
                                        </div>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${project.risk === 'High' ? 'bg-accent-red/20 text-accent-red' :
                                        project.risk === 'Medium' ? 'bg-accent-orange/20 text-accent-orange' :
                                            'bg-accent-green/20 text-accent-green'
                                    }`}>
                                    {project.risk} Risk
                                </span>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-text-secondary">Progress</span>
                                    <span className="text-text-primary font-semibold">{project.progress}%</span>
                                </div>
                                <div className="w-full bg-forest-dark rounded-full h-2">
                                    <motion.div
                                        className="bg-accent-green h-2 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${project.progress}%` }}
                                        transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                                    />
                                </div>
                                <div className="flex items-center gap-2 text-text-secondary text-sm">
                                    <Calendar className="w-4 h-4" />
                                    Status: <span className="text-accent-green font-medium">{project.status}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
