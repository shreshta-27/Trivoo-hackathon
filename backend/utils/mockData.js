// Mock/Fallback data for when AI workflows fail or database is empty

export const mockRegions = [
    {
        _id: '1',
        name: 'Amazon Rainforest',
        location: { lat: -3.4653, lng: -62.2159 },
        projectCount: 12,
        criticalProjects: 2,
        status: 'warning',
        description: 'Largest tropical rainforest in the world'
    },
    {
        _id: '2',
        name: 'Great Barrier Reef',
        location: { lat: -18.2871, lng: 147.6992 },
        projectCount: 8,
        criticalProjects: 1,
        status: 'stable',
        description: 'World\'s largest coral reef system'
    },
    {
        _id: '3',
        name: 'Arctic Circle',
        location: { lat: 66.5633, lng: -45.6469 },
        projectCount: 6,
        criticalProjects: 3,
        status: 'critical',
        description: 'Polar region experiencing rapid climate change'
    },
    {
        _id: '4',
        name: 'Congo Basin',
        location: { lat: -0.7264, lng: 23.6566 },
        projectCount: 10,
        criticalProjects: 0,
        status: 'healthy',
        description: 'Second largest rainforest in the world'
    },
    {
        _id: '5',
        name: 'Himalayan Region',
        location: { lat: 28.5984, lng: 83.9956 },
        projectCount: 7,
        criticalProjects: 1,
        status: 'stable',
        description: 'Mountain range with critical water resources'
    },
    {
        _id: '6',
        name: 'Pacific Islands',
        location: { lat: -17.6509, lng: -149.4260 },
        projectCount: 5,
        criticalProjects: 0,
        status: 'stable',
        description: 'Island ecosystems vulnerable to sea level rise'
    }
];

export const mockProjects = [
    {
        _id: 'proj1',
        name: 'Amazon Reforestation Initiative',
        region: 'Amazon Rainforest',
        treesPlanted: 15000,
        startDate: '2024-01-15',
        healthScore: 92,
        status: 'healthy',
        criticalLevel: false
    },
    {
        _id: 'proj2',
        name: 'Coral Restoration Project',
        region: 'Great Barrier Reef',
        treesPlanted: 5000,
        startDate: '2024-03-20',
        healthScore: 68,
        status: 'warning',
        criticalLevel: false
    },
    {
        _id: 'proj3',
        name: 'Arctic Biodiversity Conservation',
        region: 'Arctic Circle',
        treesPlanted: 3000,
        startDate: '2023-11-10',
        healthScore: 45,
        status: 'critical',
        criticalLevel: true
    },
    {
        _id: 'proj4',
        name: 'Congo Basin Forest Protection',
        region: 'Congo Basin',
        treesPlanted: 12000,
        startDate: '2024-02-05',
        healthScore: 88,
        status: 'healthy',
        criticalLevel: false
    }
];

export const mockIncidents = [
    {
        _id: 'inc1',
        title: 'Wildfire Alert: Amazon Region Under Threat',
        type: 'WILDFIRE',
        severity: 'critical',
        region: 'Amazon Rainforest, Brazil',
        location: 'Amazon Rainforest',
        source: 'Satellite Data',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        description: 'Satellite imagery shows rapidly spreading wildfire threatening reforestation areas. Immediate evacuation...',
        affectedProjects: ['proj1']
    },
    {
        _id: 'inc2',
        title: 'Illegal Deforestation Activity Detected',
        type: 'DEFORESTATION',
        severity: 'high',
        region: 'Congo Basin, DRC',
        location: 'Congo Basin',
        source: 'Ground Monitoring',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        description: 'Unauthorized logging operations detected in protected conservation zone. Local authorities have been...',
        affectedProjects: ['proj4']
    },
    {
        _id: 'inc3',
        name: 'Industrial Pollution Levels Rising',
        type: 'POLLUTION',
        severity: 'high',
        region: 'Great Barrier Reef, Australia',
        location: 'Great Barrier Reef',
        source: 'Water Quality Sensors',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        description: 'Water quality monitoring shows increased pollutant levels from nearby industrial facilities affectin...',
        affectedProjects: ['proj2']
    },
    {
        _id: 'inc4',
        title: 'Drought Conditions Worsening',
        type: 'DROUGHT',
        severity: 'medium',
        region: 'Amazon Rainforest, Peru',
        location: 'Amazon Rainforest',
        source: 'Climate Monitoring',
        timestamp: new Date(Date.now() - 17 * 60 * 60 * 1000).toISOString(),
        description: 'Extended dry period causing soil moisture levels to drop below optimal range. Newly planted seed...',
        affectedProjects: []
    },
    {
        _id: 'inc5',
        title: 'Heavy Rainfall Warning Issued',
        type: 'FLOOD',
        severity: 'medium',
        region: 'Congo Basin, Congo',
        location: 'Congo Basin',
        source: 'Meteorological Services',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        description: 'Meteorological services predict heavy rainfall over the next 48 hours. Flood prevention measures bel...',
        affectedProjects: []
    },
    {
        _id: 'inc6',
        title: 'Air Quality Index Deteriorating',
        type: 'POLLUTION',
        severity: 'low',
        region: 'Arctic Circle, Norway',
        location: 'Arctic Circle',
        source: 'Air Quality Stations',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Seasonal air quality decline observed due to increased shipping activity in Arctic waters....',
        affectedProjects: []
    }
];

export const mockRecommendations = [
    {
        _id: 'rec1',
        title: 'Increase Irrigation Frequency',
        priority: 'high',
        confidence: 0.89,
        reason: 'Soil moisture levels below optimal range for newly planted seedlings',
        project: 'proj1',
        projectName: 'Amazon Reforestation Initiative',
        status: 'active'
    },
    {
        _id: 'rec2',
        title: 'Deploy Fire Prevention Team',
        priority: 'critical',
        confidence: 0.95,
        reason: 'High wildfire risk detected in surrounding areas',
        project: 'proj1',
        projectName: 'Amazon Reforestation Initiative',
        status: 'active'
    },
    {
        _id: 'rec3',
        title: 'Implement Coral Bleaching Mitigation',
        priority: 'high',
        confidence: 0.82,
        reason: 'Water temperature rising above coral tolerance threshold',
        project: 'proj2',
        projectName: 'Coral Restoration Project',
        status: 'active'
    },
    {
        _id: 'rec4',
        title: 'Enhance Security Patrols',
        priority: 'medium',
        confidence: 0.76,
        reason: 'Illegal logging activity detected in nearby areas',
        project: 'proj4',
        projectName: 'Congo Basin Forest Protection',
        status: 'active'
    }
];

export const mockDashboardData = {
    summary: {
        totalRegions: 6,
        totalProjects: 48,
        projectsAtRisk: 7,
        criticalAlerts: 3
    },
    regions: mockRegions,
    recentIncidents: mockIncidents.slice(0, 4),
    criticalProjects: mockProjects.filter(p => p.criticalLevel)
};

export const mockMapData = {
    regions: mockRegions,
    markers: mockRegions.map(r => ({
        id: r._id,
        name: r.name,
        position: r.location,
        status: r.status,
        projects: r.projectCount
    }))
};
