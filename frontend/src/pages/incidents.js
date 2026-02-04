import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { Newspaper, Clock, MapPin, ExternalLink } from 'lucide-react';

const incidents = [
    {
        title: 'Forest Fire Contained in Nashik Region',
        location: 'Nashik Zone',
        time: '2 hours ago',
        severity: 'High',
        description: 'Emergency response teams successfully contained a forest fire that threatened 50 hectares of protected woodland.',
    },
    {
        title: 'Drought Conditions Worsen in Western Regions',
        location: 'Pune Zone',
        time: '5 hours ago',
        severity: 'Medium',
        description: 'Rainfall deficit reaches 35% below seasonal average, impacting forest health and water availability.',
    },
    {
        title: 'New Conservation Initiative Launched',
        location: 'Delhi Region',
        time: '1 day ago',
        severity: 'Low',
        description: 'Government announces $2M funding for urban forest expansion and biodiversity protection programs.',
    },
    {
        title: 'Illegal Logging Activity Detected',
        location: 'Nagpur Zone',
        time: '2 days ago',
        severity: 'High',
        description: 'Satellite imagery reveals unauthorized deforestation. Authorities have been notified and investigation is underway.',
    },
];

export default function Incidents() {
    return (
        <Layout>
            <div className="space-y-6">
                <motion.h1
                    className="text-3xl font-bold text-text-primary"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    Incidents & News
                </motion.h1>

                <div className="space-y-4">
                    {incidents.map((incident, index) => (
                        <motion.div
                            key={incident.title}
                            className="card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-lg ${incident.severity === 'High' ? 'bg-accent-red/10' :
                                        incident.severity === 'Medium' ? 'bg-accent-orange/10' :
                                            'bg-accent-green/10'
                                    }`}>
                                    <Newspaper className={`w-6 h-6 ${incident.severity === 'High' ? 'text-accent-red' :
                                            incident.severity === 'Medium' ? 'text-accent-orange' :
                                                'text-accent-green'
                                        }`} />
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-xl font-semibold text-text-primary">{incident.title}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${incident.severity === 'High' ? 'bg-accent-red/20 text-accent-red' :
                                                incident.severity === 'Medium' ? 'bg-accent-orange/20 text-accent-orange' :
                                                    'bg-accent-green/20 text-accent-green'
                                            }`}>
                                            {incident.severity}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4 text-text-secondary text-sm mb-3">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            {incident.location}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {incident.time}
                                        </div>
                                    </div>

                                    <p className="text-text-secondary mb-4">{incident.description}</p>

                                    <motion.button
                                        className="flex items-center gap-2 text-accent-green text-sm font-medium hover:gap-3 transition-all"
                                        whileHover={{ x: 2 }}
                                    >
                                        Read More
                                        <ExternalLink className="w-4 h-4" />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
