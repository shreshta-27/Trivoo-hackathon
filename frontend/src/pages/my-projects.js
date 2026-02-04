import { useState } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
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
    });
    const [analyzedData, setAnalyzedData] = useState(null);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    };

    const projects = [
        {
            id: 1,
            name: 'Amazon Reforestation Initiative',
            region: 'Amazon Rainforest',
            treesPlanted: 15000,
            health: 'healthy',
            healthScore: 92,
            plantationDate: '2024-01-15',
        },
        {
            id: 2,
            name: 'Coral Restoration Project',
            region: 'Great Barrier Reef',
            treesPlanted: 5000,
            health: 'warning',
            healthScore: 68,
            plantationDate: '2024-03-20',
        },
        {
            id: 3,
            name: 'Arctic Biodiversity Conservation',
            region: 'Arctic Circle',
            treesPlanted: 3000,
            health: 'critical',
            healthScore: 45,
            plantationDate: '2023-11-10',
        },
        {
            id: 4,
            name: 'Congo Basin Forest Protection',
            region: 'Congo Basin',
            treesPlanted: 12000,
            health: 'healthy',
            healthScore: 88,
            plantationDate: '2024-02-05',
        },
    ];

    const regions = [
        { id: 1, name: 'Amazon Rainforest' },
        { id: 2, name: 'Great Barrier Reef' },
        { id: 3, name: 'Arctic Circle' },
        { id: 4, name: 'Congo Basin' },
        { id: 5, name: 'Himalayan Region' },
        { id: 6, name: 'Pacific Islands' },
    ];

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

    const getHealthBadgeStyle = (health) => {
        const color = getHealthColor(health);
        return {
            background: `${color}20`,
            color: color,
            padding: '0.375rem 0.75rem',
            borderRadius: '8px',
            fontSize: '0.75rem',
            fontWeight: '600',
            textTransform: 'uppercase',
        };
    };

    const handleCreateProject = () => {
        setShowCreateModal(true);
        setCreateStep(1);
        setSelectedRegion(null);
        setFormData({ projectName: '', treesPlanted: '', plantationDate: '' });
        setAnalyzedData(null);
    };

    const handleRegionSelect = (region) => {
        setSelectedRegion(region);
    };

    const handleNextStep = () => {
        if (createStep === 1 && selectedRegion) {
            setCreateStep(2);
        } else if (createStep === 2 && formData.projectName && formData.treesPlanted && formData.plantationDate) {
            setCreateStep(3);
        }
    };

    const handleAnalyzeData = () => {
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

    const handleConfirmProject = () => {
        console.log('Creating project:', { ...formData, region: selectedRegion, analyzedData });
        setShowCreateModal(false);
    };

    const handleViewDetails = (projectId) => {
        router.push(`/project-detail?id=${projectId}`);
    };

    return (
        <DashboardLayout activePage="my-projects">
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                {}
                <motion.div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '2rem',
                    }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div>
                        <h1
                            style={{
                                fontSize: '2.5rem',
                                fontWeight: '700',
                                marginBottom: '0.5rem',
                                background: 'linear-gradient(135deg, var(--text-primary), var(--emerald-green))',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            My Projects
                        </h1>
                        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
                            Manage and monitor your environmental projects
                        </p>
                    </div>
                    <motion.button
                        onClick={handleCreateProject}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.875rem 1.5rem',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, var(--emerald-green), var(--bright-green))',
                            border: 'none',
                            color: '#ffffff',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
                        }}
                        whileHover={{ scale: 1.05, boxShadow: '0 6px 24px rgba(16, 185, 129, 0.5)' }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Plus style={{ width: '20px', height: '20px' }} />
                        Create Project
                    </motion.button>
                </motion.div>

                {}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                        gap: '1.5rem',
                    }}
                >
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            className="glass-card"
                            style={{
                                padding: '1.5rem',
                                cursor: 'pointer',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            whileHover={{
                                scale: 1.02,
                                y: -8,
                                boxShadow: '0 20px 60px rgba(16, 185, 129, 0.25)',
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

                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    marginBottom: '0.75rem',
                                }}
                            >
                                <MapPin style={{ width: '16px', height: '16px', color: 'var(--emerald-green)' }} />
                                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    {project.region}
                                </span>
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    marginBottom: '0.75rem',
                                }}
                            >
                                <TreePine style={{ width: '16px', height: '16px', color: 'var(--emerald-green)' }} />
                                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    {project.treesPlanted.toLocaleString()} trees planted
                                </span>
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    marginBottom: '1rem',
                                }}
                            >
                                <Calendar style={{ width: '16px', height: '16px', color: 'var(--emerald-green)' }} />
                                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    Started {formatDate(project.plantationDate)}
                                </span>
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '1rem',
                                }}
                            >
                                <div style={getHealthBadgeStyle(project.health)}>{project.health}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <TrendingUp
                                        style={{ width: '16px', height: '16px', color: getHealthColor(project.health) }}
                                    />
                                    <span
                                        style={{
                                            fontSize: '1.25rem',
                                            fontWeight: '600',
                                            color: getHealthColor(project.health),
                                        }}
                                    >
                                        {project.healthScore}%
                                    </span>
                                </div>
                            </div>

                            <motion.button
                                onClick={() => handleViewDetails(project.id)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
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
                                whileHover={{
                                    background: 'rgba(16, 185, 129, 0.2)',
                                    scale: 1.02,
                                }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Eye style={{ width: '16px', height: '16px' }} />
                                View Details
                            </motion.button>
                        </motion.div>
                    ))}
                </div>

                {}
                <AnimatePresence>
                    {showCreateModal && (
                        <motion.div
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(0, 0, 0, 0.7)',
                                backdropFilter: 'blur(10px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 9999,
                                padding: '2rem',
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowCreateModal(false)}
                        >
                            <motion.div
                                className="glass-card"
                                style={{
                                    maxWidth: '800px',
                                    width: '100%',
                                    maxHeight: '90vh',
                                    overflow: 'auto',
                                    padding: '2rem',
                                    position: 'relative',
                                }}
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    style={{
                                        position: 'absolute',
                                        top: '1rem',
                                        right: '1rem',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '0.5rem',
                                        cursor: 'pointer',
                                        color: 'var(--text-secondary)',
                                    }}
                                >
                                    <X style={{ width: '20px', height: '20px' }} />
                                </button>

                                <h2
                                    style={{
                                        fontSize: '1.875rem',
                                        fontWeight: '700',
                                        marginBottom: '0.5rem',
                                        color: 'var(--text-primary)',
                                    }}
                                >
                                    Create New Project
                                </h2>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                                    Step {createStep} of 3
                                </p>

                                {}
                                {createStep === 1 && (
                                    <div>
                                        <h3
                                            style={{
                                                fontSize: '1.25rem',
                                                fontWeight: '600',
                                                marginBottom: '1rem',
                                                color: 'var(--text-primary)',
                                            }}
                                        >
                                            Select Region
                                        </h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                                            {regions.map((region) => (
                                                <motion.button
                                                    key={region.id}
                                                    onClick={() => handleRegionSelect(region)}
                                                    style={{
                                                        padding: '1rem',
                                                        borderRadius: '10px',
                                                        background:
                                                            selectedRegion?.id === region.id
                                                                ? 'rgba(16, 185, 129, 0.2)'
                                                                : 'rgba(255, 255, 255, 0.05)',
                                                        border:
                                                            selectedRegion?.id === region.id
                                                                ? '2px solid var(--emerald-green)'
                                                                : '1px solid var(--glass-border)',
                                                        color: 'var(--text-primary)',
                                                        cursor: 'pointer',
                                                        textAlign: 'left',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.75rem',
                                                    }}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    <MapPin
                                                        style={{
                                                            width: '20px',
                                                            height: '20px',
                                                            color: 'var(--emerald-green)',
                                                        }}
                                                    />
                                                    {region.name}
                                                    {selectedRegion?.id === region.id && (
                                                        <CheckCircle
                                                            style={{
                                                                width: '16px',
                                                                height: '16px',
                                                                color: 'var(--emerald-green)',
                                                                marginLeft: 'auto',
                                                            }}
                                                        />
                                                    )}
                                                </motion.button>
                                            ))}
                                        </div>
                                        <motion.button
                                            onClick={handleNextStep}
                                            disabled={!selectedRegion}
                                            style={{
                                                width: '100%',
                                                marginTop: '2rem',
                                                padding: '0.875rem',
                                                borderRadius: '10px',
                                                background: selectedRegion
                                                    ? 'linear-gradient(135deg, var(--emerald-green), var(--bright-green))'
                                                    : 'rgba(255, 255, 255, 0.1)',
                                                border: 'none',
                                                color: selectedRegion ? '#ffffff' : 'var(--text-muted)',
                                                fontSize: '1rem',
                                                fontWeight: '600',
                                                cursor: selectedRegion ? 'pointer' : 'not-allowed',
                                            }}
                                            whileHover={selectedRegion ? { scale: 1.02 } : {}}
                                            whileTap={selectedRegion ? { scale: 0.98 } : {}}
                                        >
                                            Next: Enter Project Details
                                        </motion.button>
                                    </div>
                                )}

                                {}
                                {createStep === 2 && (
                                    <div>
                                        <h3
                                            style={{
                                                fontSize: '1.25rem',
                                                fontWeight: '600',
                                                marginBottom: '1rem',
                                                color: 'var(--text-primary)',
                                            }}
                                        >
                                            Project Details
                                        </h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                            <div>
                                                <label
                                                    style={{
                                                        display: 'block',
                                                        fontSize: '0.875rem',
                                                        fontWeight: '500',
                                                        marginBottom: '0.5rem',
                                                        color: 'var(--text-secondary)',
                                                    }}
                                                >
                                                    Project Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.projectName}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, projectName: e.target.value })
                                                    }
                                                    placeholder="Enter project name"
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.875rem',
                                                        borderRadius: '10px',
                                                        background: 'rgba(255, 255, 255, 0.05)',
                                                        border: '1px solid var(--glass-border)',
                                                        color: 'var(--text-primary)',
                                                        fontSize: '1rem',
                                                    }}
                                                />
                                            </div>

                                            <div>
                                                <label
                                                    style={{
                                                        display: 'block',
                                                        fontSize: '0.875rem',
                                                        fontWeight: '500',
                                                        marginBottom: '0.5rem',
                                                        color: 'var(--text-secondary)',
                                                    }}
                                                >
                                                    Trees Planted
                                                </label>
                                                <input
                                                    type="number"
                                                    value={formData.treesPlanted}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, treesPlanted: e.target.value })
                                                    }
                                                    placeholder="Enter number of trees"
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.875rem',
                                                        borderRadius: '10px',
                                                        background: 'rgba(255, 255, 255, 0.05)',
                                                        border: '1px solid var(--glass-border)',
                                                        color: 'var(--text-primary)',
                                                        fontSize: '1rem',
                                                    }}
                                                />
                                            </div>

                                            <div>
                                                <label
                                                    style={{
                                                        display: 'block',
                                                        fontSize: '0.875rem',
                                                        fontWeight: '500',
                                                        marginBottom: '0.5rem',
                                                        color: 'var(--text-secondary)',
                                                    }}
                                                >
                                                    Plantation Date
                                                </label>
                                                <input
                                                    type="date"
                                                    value={formData.plantationDate}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, plantationDate: e.target.value })
                                                    }
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.875rem',
                                                        borderRadius: '10px',
                                                        background: 'rgba(255, 255, 255, 0.05)',
                                                        border: '1px solid var(--glass-border)',
                                                        color: 'var(--text-primary)',
                                                        fontSize: '1rem',
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                            <motion.button
                                                onClick={() => setCreateStep(1)}
                                                style={{
                                                    flex: 1,
                                                    padding: '0.875rem',
                                                    borderRadius: '10px',
                                                    background: 'rgba(255, 255, 255, 0.1)',
                                                    border: '1px solid var(--glass-border)',
                                                    color: 'var(--text-secondary)',
                                                    fontSize: '1rem',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                }}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                Back
                                            </motion.button>
                                            <motion.button
                                                onClick={handleNextStep}
                                                disabled={
                                                    !formData.projectName || !formData.treesPlanted || !formData.plantationDate
                                                }
                                                style={{
                                                    flex: 2,
                                                    padding: '0.875rem',
                                                    borderRadius: '10px',
                                                    background:
                                                        formData.projectName && formData.treesPlanted && formData.plantationDate
                                                            ? 'linear-gradient(135deg, var(--emerald-green), var(--bright-green))'
                                                            : 'rgba(255, 255, 255, 0.1)',
                                                    border: 'none',
                                                    color:
                                                        formData.projectName && formData.treesPlanted && formData.plantationDate
                                                            ? '#ffffff'
                                                            : 'var(--text-muted)',
                                                    fontSize: '1rem',
                                                    fontWeight: '600',
                                                    cursor:
                                                        formData.projectName && formData.treesPlanted && formData.plantationDate
                                                            ? 'pointer'
                                                            : 'not-allowed',
                                                }}
                                                whileHover={
                                                    formData.projectName && formData.treesPlanted && formData.plantationDate
                                                        ? { scale: 1.02 }
                                                        : {}
                                                }
                                                whileTap={
                                                    formData.projectName && formData.treesPlanted && formData.plantationDate
                                                        ? { scale: 0.98 }
                                                        : {}
                                                }
                                            >
                                                Next: Analyze Data
                                            </motion.button>
                                        </div>
                                    </div>
                                )}

                                {}
                                {createStep === 3 && (
                                    <div>
                                        <h3
                                            style={{
                                                fontSize: '1.25rem',
                                                fontWeight: '600',
                                                marginBottom: '1rem',
                                                color: 'var(--text-primary)',
                                            }}
                                        >
                                            Analyze & Confirm
                                        </h3>

                                        {!analyzedData ? (
                                            <div>
                                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                                                    Click the button below to analyze your project data and receive AI-powered species
                                                    recommendations based on soil health, climate, and regional conditions.
                                                </p>
                                                <motion.button
                                                    onClick={handleAnalyzeData}
                                                    style={{
                                                        width: '100%',
                                                        padding: '1rem',
                                                        borderRadius: '10px',
                                                        background: 'linear-gradient(135deg, var(--emerald-green), var(--bright-green))',
                                                        border: 'none',
                                                        color: '#ffffff',
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
                                                    <Sparkles style={{ width: '20px', height: '20px' }} />
                                                    Analyze Data
                                                </motion.button>
                                            </div>
                                        ) : (
                                            <div>
                                                <div
                                                    style={{
                                                        padding: '1.5rem',
                                                        borderRadius: '12px',
                                                        background: 'rgba(16, 185, 129, 0.1)',
                                                        border: '1px solid var(--emerald-green)',
                                                        marginBottom: '1.5rem',
                                                    }}
                                                >
                                                    <h4
                                                        style={{
                                                            fontSize: '1rem',
                                                            fontWeight: '600',
                                                            color: 'var(--emerald-green)',
                                                            marginBottom: '1rem',
                                                        }}
                                                    >
                                                        Recommended Species
                                                    </h4>
                                                    {analyzedData.species.map((species, index) => (
                                                        <div
                                                            key={index}
                                                            style={{
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center',
                                                                padding: '0.75rem',
                                                                marginBottom: '0.5rem',
                                                                borderRadius: '8px',
                                                                background: 'rgba(255, 255, 255, 0.05)',
                                                            }}
                                                        >
                                                            <div>
                                                                <p
                                                                    style={{
                                                                        fontSize: '0.875rem',
                                                                        fontWeight: '600',
                                                                        color: 'var(--text-primary)',
                                                                    }}
                                                                >
                                                                    {species.name}
                                                                </p>
                                                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                                    Growth: {species.growthRate}
                                                                </p>
                                                            </div>
                                                            <div
                                                                style={{
                                                                    fontSize: '1rem',
                                                                    fontWeight: '600',
                                                                    color: 'var(--emerald-green)',
                                                                }}
                                                            >
                                                                {species.suitability}%
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                                    <motion.button
                                                        onClick={() => setCreateStep(2)}
                                                        style={{
                                                            flex: 1,
                                                            padding: '0.875rem',
                                                            borderRadius: '10px',
                                                            background: 'rgba(255, 255, 255, 0.1)',
                                                            border: '1px solid var(--glass-border)',
                                                            color: 'var(--text-secondary)',
                                                            fontSize: '1rem',
                                                            fontWeight: '600',
                                                            cursor: 'pointer',
                                                        }}
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                    >
                                                        Back
                                                    </motion.button>
                                                    <motion.button
                                                        onClick={handleConfirmProject}
                                                        style={{
                                                            flex: 2,
                                                            padding: '0.875rem',
                                                            borderRadius: '10px',
                                                            background:
                                                                'linear-gradient(135deg, var(--emerald-green), var(--bright-green))',
                                                            border: 'none',
                                                            color: '#ffffff',
                                                            fontSize: '1rem',
                                                            fontWeight: '600',
                                                            cursor: 'pointer',
                                                        }}
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                    >
                                                        Confirm & Create Project
                                                    </motion.button>
                                                </div>
                                            </div>
                                        )}
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
