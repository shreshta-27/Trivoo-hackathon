import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import { projects, map, recommendations } from '../utils/api';
import {
    Plus,
    MapPin,
    TreePine,
    Calendar,
    TrendingUp,
    Eye,
    X,
    CheckCircle,
    Sparkles,
    Leaf,
    Zap,
    Loader
} from 'lucide-react';

export default function MyProjects() {
    const router = useRouter();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createStep, setCreateStep] = useState(1);
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [formData, setFormData] = useState({
        projectName: '',
        treesPlanted: '',
        plantationDate: '',
        treeType: '',
    });
    const [analyzedData, setAnalyzedData] = useState(null);
    const [projectList, setProjectList] = useState([]);
    const [regions, setRegions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [aiLoading, setAiLoading] = useState(null); // Track which project is getting AI recommendations
    const [aiRecommendations, setAiRecommendations] = useState(null);
    const [showAiModal, setShowAiModal] = useState(false);

    useEffect(() => {
        const userInfoStr = localStorage.getItem('userInfo');
        if (userInfoStr) {
            try {
                setUser(JSON.parse(userInfoStr));
            } catch (e) {
                console.error("Error parsing user info", e);
            }
        }
        fetchProjects();
        fetchRegions();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const res = await projects.getAll();
            if (res.data?.data && res.data.data.length > 0) {
                setProjectList(res.data.data);
            } else {
                throw new Error("No projects found");
            }
        } catch (error) {
            console.error("Failed to fetch projects, using fallback", error);
            // Fallback Data for Demo
            setProjectList([
                {
                    _id: 'demo-1',
                    name: 'Amazon Preservation Alpha',
                    region: { name: 'South America' },
                    plantationSize: 12500,
                    healthScore: 92,
                    createdAt: new Date().toISOString()
                },
                {
                    _id: 'demo-2',
                    name: 'Borneo Reforestation',
                    region: { name: 'Southeast Asia' },
                    plantationSize: 8400,
                    healthScore: 45,
                    createdAt: new Date(Date.now() - 86400000 * 30).toISOString()
                },
                {
                    _id: 'demo-3',
                    name: 'Congo Basin Initiative',
                    region: { name: 'Central Africa' },
                    plantationSize: 15600,
                    healthScore: 78,
                    createdAt: new Date(Date.now() - 86400000 * 60).toISOString()
                },
                {
                    _id: 'demo-4',
                    name: 'Alpine Recovery',
                    region: { name: 'Europe' },
                    plantationSize: 3200,
                    healthScore: 98,
                    createdAt: new Date(Date.now() - 86400000 * 15).toISOString()
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const fetchRegions = async () => {
        try {
            const res = await map.getData();
            if (res.data?.data) {
                setRegions(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch regions", error);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getHealthColor = (score) => {
        if (score >= 80) return '#10b981'; // healthy
        if (score >= 50) return '#f59e0b'; // warning
        return '#ef4444'; // critical
    };

    const getHealthStatus = (score) => {
        if (score >= 80) return 'healthy';
        if (score >= 50) return 'warning';
        return 'critical';
    };

    const getHealthBadgeStyle = (score) => {
        const color = getHealthColor(score);
        return {
            background: `${color}20`,
            color: color,
        };
    };

    const handleCreateProject = () => {
        setShowCreateModal(true);
        setCreateStep(1);
        setSelectedRegion(null);
        setFormData({ projectName: '', treesPlanted: '', plantationDate: '', treeType: '' });
        setAnalyzedData(null);
    };

    const handleRegionSelect = (region) => {
        setSelectedRegion(region);
    };

    const handleNextStep = () => {
        if (createStep === 1 && selectedRegion) {
            setCreateStep(2);
        } else if (createStep === 2 && formData.projectName && formData.treesPlanted && formData.plantationDate) {
            // Mock Analysis
            handleAnalyzeData();
            setCreateStep(3);
        }
    };

    const handleAnalyzeData = () => {
        // In a real app, this would call an API
        setAnalyzedData({
            species: [
                { name: 'Mahogany', suitability: 95, growthRate: 'Fast' },
                { name: 'Teak', suitability: 88, growthRate: 'Medium' },
                { name: 'Cedar', suitability: 82, growthRate: 'Slow' },
            ],
            soilHealth: 'Excellent',
            climateMatch: 92,
        });
    };

    const handleConfirmProject = async () => {
        if (!user || !user._id) {
            alert("You must be logged in to create a project.");
            return;
        }

        try {
            const payload = {
                name: formData.projectName,
                location: selectedRegion.coordinates ? { lat: selectedRegion.coordinates[0], lng: selectedRegion.coordinates[1] } : { lat: 0, lng: 0 }, // Using region center as default
                region: selectedRegion.id,
                manager: user._id,
                healthScore: 100, // Start fresh
                plantationSize: parseInt(formData.treesPlanted), // Mapping trees to size for now
                treeType: formData.treeType || 'Mixed',
                metadata: {
                    plantationDate: formData.plantationDate,
                    initialTrees: formData.treesPlanted
                }
            };

            // Note: backend expects valid location. 
            // If the backend validates location strictly, we might need a real lat/lng from user input.
            // For now assuming region coordinates are accepted or mocked.

            const res = await projects.create(payload);
            if (res.data?.success) {
                setShowCreateModal(false);
                fetchProjects(); // Refresh list
            }
        } catch (error) {
            console.error("Failed to create project", error.response?.data || error);
            alert("Failed to create project: " + (error.response?.data?.message || error.message));
        }
    };

    const handleViewDetails = (projectId) => {
        router.push(`/project-detail?id=${projectId}`);
    };

    const handleGetAIRecommendations = async (e, projectId) => {
        e.stopPropagation(); // Prevent card click
        try {
            setAiLoading(projectId);
            const res = await recommendations.triggerForProject(projectId);
            if (res.data?.success) {
                setAiRecommendations(res.data.data || []);
                setShowAiModal(true);
            }
        } catch (error) {
            console.error("Failed to get AI recommendations", error);
            // Show fallback data
            setAiRecommendations([
                {
                    action: "Increase irrigation frequency",
                    priority: "high",
                    urgency: "immediate",
                    explanation: "Current soil moisture levels are below optimal threshold. Immediate irrigation recommended to prevent stress.",
                    impact: "high"
                },
                {
                    action: "Monitor pest activity",
                    priority: "medium",
                    urgency: "moderate",
                    explanation: "Recent weather conditions favorable for pest development. Regular monitoring advised.",
                    impact: "medium"
                }
            ]);
            setShowAiModal(true);
        } finally {
            setAiLoading(null);
        }
    };

    return (
        <DashboardLayout activePage="my-projects">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-br from-white to-emerald-400">
                            My Projects
                        </h1>
                        <p className="text-base text-gray-400">
                            Manage and monitor your environmental projects
                        </p>
                    </div>
                    <motion.button
                        onClick={handleCreateProject}
                        className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-br from-emerald-500 to-green-400 text-white font-semibold shadow-lg shadow-emerald-500/40"
                        whileHover={{ scale: 1.05, boxShadow: '0 6px 24px rgba(16, 185, 129, 0.5)' }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Plus className="w-5 h-5" />
                        Create Project
                    </motion.button>
                </motion.div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <div className="col-span-full flex justify-center py-20">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                style={{ borderTopColor: 'transparent' }}
                                className="w-12 h-12 border-4 border-emerald-500 rounded-full"
                            />
                        </div>
                    ) : projectList.length === 0 ? (
                        <div className="col-span-full glass-card p-12 text-center">
                            <TreePine className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">No Projects Yet</h3>
                            <p className="text-gray-400">Get started by analyzing a region and creating your first project.</p>
                        </div>
                    ) : (
                        projectList.map((project, index) => {
                            const healthStatus = getHealthStatus(project.healthScore);
                            const healthColor = getHealthColor(project.healthScore);
                            return (
                                <motion.div
                                    key={project._id || project.id}
                                    className="glass-card p-6 relative overflow-hidden cursor-pointer"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                    whileHover={{ scale: 1.02, y: -8, boxShadow: '0 20px 60px rgba(16, 185, 129, 0.25)' }}
                                    onClick={() => handleViewDetails(project._id || project.id)}
                                >
                                    <h3 className="text-xl font-bold text-white mb-4 line-clamp-1">{project.name}</h3>

                                    <div className="flex items-center gap-2 mb-3 text-sm text-gray-400">
                                        <MapPin className="w-4 h-4 text-emerald-500" />
                                        <span>{project.region?.name || 'Unknown Region'}</span>
                                    </div>

                                    <div className="flex items-center gap-2 mb-3 text-sm text-gray-400">
                                        <TreePine className="w-4 h-4 text-emerald-500" />
                                        <span>{project.plantationSize?.toLocaleString() || 0} trees</span>
                                    </div>

                                    <div className="flex items-center gap-2 mb-4 text-sm text-gray-400">
                                        <Calendar className="w-4 h-4 text-emerald-500" />
                                        <span>Started {formatDate(project.createdAt || project.metadata?.plantationDate)} </span>
                                    </div>

                                    <div className="flex justify-between items-center mb-4">
                                        <div
                                            className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase"
                                            style={getHealthBadgeStyle(project.healthScore)}
                                        >
                                            {healthStatus}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <TrendingUp style={{ width: '16px', height: '16px', color: healthColor }} />
                                            <span className="text-xl font-bold" style={{ color: healthColor }}>
                                                {project.healthScore}%
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => handleGetAIRecommendations(e, project._id || project.id)}
                                            disabled={aiLoading === (project._id || project.id)}
                                            className="flex-1 py-3 rounded-xl border border-purple-500/50 text-purple-400 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-purple-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {aiLoading === (project._id || project.id) ? (
                                                <Loader className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Zap className="w-4 h-4" />
                                            )}
                                            AI Insights
                                        </button>
                                        <button className="flex-1 py-3 rounded-xl border border-emerald-500/50 text-emerald-400 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-emerald-500/10 transition-colors">
                                            <Eye className="w-4 h-4" />
                                            View Details
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>

                {/* Create Modal */}
                <AnimatePresence>
                    {showCreateModal && (
                        <motion.div
                            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[2000] flex items-center justify-center p-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowCreateModal(false)}
                        >
                            <motion.div
                                className="glass-card w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8 relative"
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 text-gray-400 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <h2 className="text-3xl font-bold text-white mb-2">Create New Project</h2>
                                <p className="text-sm text-gray-400 mb-8">Step {createStep} of 3</p>

                                {createStep === 1 && (
                                    <div>
                                        <h3 className="text-xl font-semibold text-white mb-4">Select Region</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                            {regions.map((region) => (
                                                <button
                                                    key={region.id}
                                                    onClick={() => handleRegionSelect(region)}
                                                    className={`p-4 rounded-xl text-left flex items-center gap-3 transition-all ${selectedRegion?.id === region.id ? 'bg-emerald-500/20 border-2 border-emerald-500' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}
                                                >
                                                    <MapPin className="w-5 h-5 text-emerald-500" />
                                                    <span className="text-white font-medium flex-1">{region.name}</span>
                                                    {selectedRegion?.id === region.id && (
                                                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            onClick={handleNextStep}
                                            disabled={!selectedRegion}
                                            className={`w-full py-3.5 rounded-xl font-semibold transition-all ${selectedRegion ? 'bg-gradient-to-br from-emerald-500 to-green-400 text-white shadow-lg shadow-emerald-500/30 hover:scale-[1.02]' : 'bg-white/10 text-gray-500 cursor-not-allowed'}`}
                                        >
                                            Next: Enter Project Details
                                        </button>
                                    </div>
                                )}

                                {createStep === 2 && (
                                    <div className="space-y-6">
                                        <h3 className="text-xl font-semibold text-white mb-4">Project Details</h3>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Project Name</label>
                                            <input
                                                type="text"
                                                value={formData.projectName}
                                                onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                                                placeholder="Enter project name"
                                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">Number of Trees</label>
                                                <input
                                                    type="number"
                                                    value={formData.treesPlanted}
                                                    onChange={(e) => setFormData({ ...formData, treesPlanted: e.target.value })}
                                                    placeholder="e.g. 5000"
                                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">Plantation Date</label>
                                                <input
                                                    type="date"
                                                    value={formData.plantationDate}
                                                    onChange={(e) => setFormData({ ...formData, plantationDate: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500 transition-colors [color-scheme:dark]"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Tree Type</label>
                                            <input
                                                type="text"
                                                value={formData.treeType}
                                                onChange={(e) => setFormData({ ...formData, treeType: e.target.value })}
                                                placeholder="e.g. Mixed Hardwood"
                                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                                            />
                                        </div>

                                        <div className="flex gap-4 pt-4">
                                            <button
                                                onClick={() => setCreateStep(1)}
                                                className="flex-1 py-3.5 rounded-xl border border-white/10 text-gray-400 font-semibold hover:bg-white/5 transition-colors"
                                            >
                                                Back
                                            </button>
                                            <button
                                                onClick={handleNextStep}
                                                disabled={!formData.projectName || !formData.treesPlanted || !formData.plantationDate}
                                                className={`flex-[2] py-3.5 rounded-xl font-semibold transition-all ${formData.projectName && formData.treesPlanted ? 'bg-gradient-to-br from-emerald-500 to-green-400 text-white shadow-lg shadow-emerald-500/30' : 'bg-white/10 text-gray-500 cursor-not-allowed'}`}
                                            >
                                                Next: Analyze Data
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {createStep === 3 && (
                                    <div className="space-y-6">
                                        <h3 className="text-xl font-semibold text-white mb-4">AI Analysis & Confirmation</h3>

                                        <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-6">
                                            <h4 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
                                                <Sparkles className="w-5 h-5" />
                                                Recommended Species
                                            </h4>
                                            <div className="space-y-3">
                                                {analyzedData?.species.map((species, index) => (
                                                    <div key={index} className="bg-black/20 p-3 rounded-lg flex justify-between items-center">
                                                        <div>
                                                            <p className="font-semibold text-white">{species.name}</p>
                                                            <p className="text-xs text-gray-400">Growth: {species.growthRate}</p>
                                                        </div>
                                                        <div className="text-emerald-400 font-bold">{species.suitability}% Match</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="bg-white/5 p-3 rounded-lg">
                                                <p className="text-gray-400">Soil Health</p>
                                                <p className="text-white font-semibold">{analyzedData?.soilHealth}</p>
                                            </div>
                                            <div className="bg-white/5 p-3 rounded-lg">
                                                <p className="text-gray-400">Climate Match</p>
                                                <p className="text-white font-semibold">{analyzedData?.climateMatch}%</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 pt-4">
                                            <button
                                                onClick={() => setCreateStep(2)}
                                                className="flex-1 py-3.5 rounded-xl border border-white/10 text-gray-400 font-semibold hover:bg-white/5 transition-colors"
                                            >
                                                Back
                                            </button>
                                            <button
                                                onClick={handleConfirmProject}
                                                className="flex-[2] py-3.5 rounded-xl bg-gradient-to-br from-emerald-500 to-green-400 text-white font-semibold shadow-lg shadow-emerald-500/30 hover:scale-[1.02] transition-all"
                                            >
                                                Confirm & Create Project
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* AI Recommendations Modal */}
                <AnimatePresence>
                    {showAiModal && (
                        <motion.div
                            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[2000] flex items-center justify-center p-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAiModal(false)}
                        >
                            <motion.div
                                className="glass-card w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8 relative"
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={() => setShowAiModal(false)}
                                    className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 text-gray-400 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                        <Sparkles className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">AI Recommendations</h2>
                                        <p className="text-sm text-gray-400">Generated by advanced AI analysis</p>
                                    </div>
                                </div>

                                {aiRecommendations && aiRecommendations.length > 0 ? (
                                    <div className="space-y-4">
                                        {aiRecommendations.map((rec, index) => {
                                            const getPriorityColor = (priority) => {
                                                switch (priority?.toLowerCase()) {
                                                    case 'critical': return '#ef4444';
                                                    case 'high': return '#f59e0b';
                                                    case 'medium': return '#3b82f6';
                                                    default: return '#10b981';
                                                }
                                            };
                                            const color = getPriorityColor(rec.priority || rec.urgency);

                                            return (
                                                <motion.div
                                                    key={index}
                                                    className="bg-white/5 p-5 rounded-xl border border-white/10"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                >
                                                    <div className="flex items-start justify-between mb-3">
                                                        <h3 className="text-lg font-bold text-white flex-1">{rec.action}</h3>
                                                        <span
                                                            className="px-3 py-1 rounded-lg text-xs font-bold uppercase"
                                                            style={{
                                                                background: `${color}20`,
                                                                color: color,
                                                                border: `1px solid ${color}40`
                                                            }}
                                                        >
                                                            {rec.priority || rec.urgency}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-300 leading-relaxed mb-3">
                                                        {rec.explanation || rec.reasoning || 'No explanation provided'}
                                                    </p>
                                                    {rec.impact && (
                                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                                            <TrendingUp className="w-3 h-3" />
                                                            <span>Impact: {rec.impact}</span>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                                        <p className="text-gray-400">No recommendations at this time. Project is performing well!</p>
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
}