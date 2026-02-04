export const cropsData = [
    {
        name: 'Bamboo',
        scientificName: 'Bambusoideae',
        priority: 1,
        description: 'Fastest growing plant with high survival rate and low maintenance. Perfect for government and CSR projects.',
        characteristics: {
            growthRate: 'Very Fast',
            survivalRate: 'Very High',
            maintenanceLevel: 'Very Low',
            economicValue: 'High'
        },
        environmentalRequirements: {
            rainfall: { min: 1200, max: 4000 },
            temperature: { min: 10, max: 35 },
            soilTypes: ['Loamy', 'Sandy', 'Clay', 'Alluvial'],
            waterRequirement: 'Medium'
        },
        plantationDetails: {
            growthTimeMonths: 36,
            spacingMeters: 3,
            idealSeasons: ['Monsoon', 'Post-Monsoon']
        },
        benefits: {
            ecological: ['Carbon sequestration', 'Soil erosion control', 'Watershed protection'],
            economic: ['Construction material', 'Paper pulp', 'Handicrafts', 'Biofuel'],
            social: ['Employment generation', 'Rural livelihood', 'Quick returns']
        },
        riskFactors: {
            drought: 'Low',
            fire: 'Medium',
            pest: 'Low',
            disease: 'Very Low'
        },
        useCases: ['Government Projects', 'CSR Initiatives', 'Soil Stabilization', 'Commercial Forestry']
    },
    {
        name: 'Neem',
        scientificName: 'Azadirachta indica',
        priority: 2,
        description: 'Extremely hardy tree that works well in dry and semi-arid zones. High medicinal and ecological value.',
        characteristics: {
            growthRate: 'Fast',
            survivalRate: 'Very High',
            maintenanceLevel: 'Very Low',
            economicValue: 'Medium'
        },
        environmentalRequirements: {
            rainfall: { min: 400, max: 1200 },
            temperature: { min: 15, max: 45 },
            soilTypes: ['Sandy', 'Loamy', 'Black', 'Red'],
            waterRequirement: 'Very Low'
        },
        plantationDetails: {
            growthTimeMonths: 48,
            spacingMeters: 4,
            idealSeasons: ['Monsoon', 'Post-Monsoon']
        },
        benefits: {
            ecological: ['Air purification', 'Pest control', 'Soil improvement'],
            economic: ['Medicinal products', 'Pesticides', 'Timber'],
            social: ['Health benefits', 'Traditional medicine', 'Shade provider']
        },
        riskFactors: {
            drought: 'Very Low',
            fire: 'Low',
            pest: 'Very Low',
            disease: 'Very Low'
        },
        useCases: ['Government Projects', 'Forest Restoration', 'Agroforestry', 'Community Livelihood']
    },
    {
        name: 'Teak',
        scientificName: 'Tectona grandis',
        priority: 3,
        description: 'High economic value timber tree for long-term forestry projects. Requires careful planning and decision intelligence.',
        characteristics: {
            growthRate: 'Medium',
            survivalRate: 'High',
            maintenanceLevel: 'Medium',
            economicValue: 'Very High'
        },
        environmentalRequirements: {
            rainfall: { min: 1200, max: 2500 },
            temperature: { min: 20, max: 35 },
            soilTypes: ['Loamy', 'Alluvial', 'Laterite'],
            waterRequirement: 'Medium'
        },
        plantationDetails: {
            growthTimeMonths: 180,
            spacingMeters: 2.5,
            idealSeasons: ['Monsoon']
        },
        benefits: {
            ecological: ['Carbon storage', 'Biodiversity support'],
            economic: ['Premium timber', 'Furniture', 'High market value'],
            social: ['Long-term investment', 'Employment']
        },
        riskFactors: {
            drought: 'Medium',
            fire: 'Medium',
            pest: 'Medium',
            disease: 'Medium'
        },
        useCases: ['Commercial Forestry', 'Government Projects', 'CSR Initiatives']
    },
    {
        name: 'Sal',
        scientificName: 'Shorea robusta',
        priority: 4,
        description: 'Native forest restoration species. Requires correct climate conditions, demonstrating AI filtering power.',
        characteristics: {
            growthRate: 'Medium',
            survivalRate: 'High',
            maintenanceLevel: 'Low',
            economicValue: 'High'
        },
        environmentalRequirements: {
            rainfall: { min: 1000, max: 2000 },
            temperature: { min: 15, max: 32 },
            soilTypes: ['Loamy', 'Red', 'Laterite'],
            waterRequirement: 'Medium'
        },
        plantationDetails: {
            growthTimeMonths: 120,
            spacingMeters: 3,
            idealSeasons: ['Monsoon']
        },
        benefits: {
            ecological: ['Native biodiversity', 'Habitat restoration', 'Soil conservation'],
            economic: ['Timber', 'Resin', 'Seeds'],
            social: ['Cultural significance', 'Traditional use']
        },
        riskFactors: {
            drought: 'Medium',
            fire: 'High',
            pest: 'Low',
            disease: 'Low'
        },
        useCases: ['Forest Restoration', 'Government Projects', 'Commercial Forestry']
    },
    {
        name: 'Jamun',
        scientificName: 'Syzygium cumini',
        priority: 5,
        description: 'Good survival rate with agroforestry compatibility. Provides community benefits through fruit production.',
        characteristics: {
            growthRate: 'Fast',
            survivalRate: 'High',
            maintenanceLevel: 'Low',
            economicValue: 'Medium'
        },
        environmentalRequirements: {
            rainfall: { min: 800, max: 2000 },
            temperature: { min: 18, max: 38 },
            soilTypes: ['Loamy', 'Alluvial', 'Sandy'],
            waterRequirement: 'Medium'
        },
        plantationDetails: {
            growthTimeMonths: 60,
            spacingMeters: 5,
            idealSeasons: ['Monsoon', 'Post-Monsoon']
        },
        benefits: {
            ecological: ['Fruit for wildlife', 'Shade provider'],
            economic: ['Fruit production', 'Medicinal value', 'Timber'],
            social: ['Nutritional benefits', 'Income from fruits', 'Health benefits']
        },
        riskFactors: {
            drought: 'Low',
            fire: 'Low',
            pest: 'Medium',
            disease: 'Low'
        },
        useCases: ['Agroforestry', 'Community Livelihood', 'Government Projects']
    },
    {
        name: 'Arjun',
        scientificName: 'Terminalia arjuna',
        priority: 6,
        description: 'Excellent for riverbank and soil stabilization. Climate-resilient with health and ecological benefits.',
        characteristics: {
            growthRate: 'Fast',
            survivalRate: 'Very High',
            maintenanceLevel: 'Very Low',
            economicValue: 'Medium'
        },
        environmentalRequirements: {
            rainfall: { min: 750, max: 2000 },
            temperature: { min: 15, max: 40 },
            soilTypes: ['Alluvial', 'Loamy', 'Sandy'],
            waterRequirement: 'Medium'
        },
        plantationDetails: {
            growthTimeMonths: 72,
            spacingMeters: 4,
            idealSeasons: ['Monsoon']
        },
        benefits: {
            ecological: ['Riverbank protection', 'Soil binding', 'Water conservation'],
            economic: ['Medicinal bark', 'Timber', 'Tannins'],
            social: ['Cardiovascular medicine', 'Traditional healing']
        },
        riskFactors: {
            drought: 'Low',
            fire: 'Low',
            pest: 'Very Low',
            disease: 'Very Low'
        },
        useCases: ['Soil Stabilization', 'Forest Restoration', 'Community Livelihood']
    },
    {
        name: 'Mahua',
        scientificName: 'Madhuca longifolia',
        priority: 7,
        description: 'Tribal livelihood integration tree with medium maintenance. Shows seasonal sensitivity in growth patterns.',
        characteristics: {
            growthRate: 'Medium',
            survivalRate: 'High',
            maintenanceLevel: 'Medium',
            economicValue: 'Medium'
        },
        environmentalRequirements: {
            rainfall: { min: 600, max: 1500 },
            temperature: { min: 18, max: 42 },
            soilTypes: ['Red', 'Sandy', 'Loamy'],
            waterRequirement: 'Low'
        },
        plantationDetails: {
            growthTimeMonths: 84,
            spacingMeters: 6,
            idealSeasons: ['Monsoon']
        },
        benefits: {
            ecological: ['Drought resistance', 'Wildlife food source'],
            economic: ['Flower collection', 'Oil production', 'Timber'],
            social: ['Tribal economy', 'Traditional food', 'Cultural importance']
        },
        riskFactors: {
            drought: 'Low',
            fire: 'Medium',
            pest: 'Medium',
            disease: 'Medium'
        },
        useCases: ['Community Livelihood', 'Agroforestry', 'Forest Restoration']
    },
    {
        name: 'Mango',
        scientificName: 'Mangifera indica',
        priority: 8,
        description: 'Agroforestry tree requiring care and human-dependent success. Good for demonstrating maintenance loop.',
        characteristics: {
            growthRate: 'Medium',
            survivalRate: 'Medium',
            maintenanceLevel: 'High',
            economicValue: 'High'
        },
        environmentalRequirements: {
            rainfall: { min: 750, max: 2000 },
            temperature: { min: 20, max: 35 },
            soilTypes: ['Loamy', 'Alluvial', 'Sandy'],
            waterRequirement: 'High'
        },
        plantationDetails: {
            growthTimeMonths: 48,
            spacingMeters: 8,
            idealSeasons: ['Monsoon', 'Post-Monsoon']
        },
        benefits: {
            ecological: ['Shade provider', 'Soil improvement'],
            economic: ['Fruit production', 'High market value', 'Export potential'],
            social: ['Nutritional value', 'Employment', 'Food security']
        },
        riskFactors: {
            drought: 'High',
            fire: 'Medium',
            pest: 'High',
            disease: 'High'
        },
        useCases: ['Agroforestry', 'Commercial Forestry', 'Community Livelihood']
    },
    {
        name: 'Peepal',
        scientificName: 'Ficus religiosa',
        priority: 9,
        description: 'Ecologically strong tree with limited large-scale plantation practicality. High cultural significance.',
        characteristics: {
            growthRate: 'Fast',
            survivalRate: 'Very High',
            maintenanceLevel: 'Very Low',
            economicValue: 'Low'
        },
        environmentalRequirements: {
            rainfall: { min: 500, max: 2500 },
            temperature: { min: 10, max: 45 },
            soilTypes: ['Loamy', 'Sandy', 'Alluvial', 'Black'],
            waterRequirement: 'Low'
        },
        plantationDetails: {
            growthTimeMonths: 60,
            spacingMeters: 10,
            idealSeasons: ['Monsoon', 'Post-Monsoon']
        },
        benefits: {
            ecological: ['Oxygen production', 'Air purification', 'Wildlife habitat'],
            economic: ['Limited timber use', 'Medicinal leaves'],
            social: ['Religious significance', 'Cultural value', 'Community gathering']
        },
        riskFactors: {
            drought: 'Very Low',
            fire: 'Low',
            pest: 'Very Low',
            disease: 'Very Low'
        },
        useCases: ['Government Projects', 'Forest Restoration']
    },
    {
        name: 'Banyan',
        scientificName: 'Ficus benghalensis',
        priority: 10,
        description: 'Symbolic and ecological tree. Not scalable for mass plantation but important for ecosystem restoration.',
        characteristics: {
            growthRate: 'Slow',
            survivalRate: 'Very High',
            maintenanceLevel: 'Very Low',
            economicValue: 'Low'
        },
        environmentalRequirements: {
            rainfall: { min: 500, max: 2500 },
            temperature: { min: 15, max: 40 },
            soilTypes: ['Loamy', 'Alluvial', 'Sandy'],
            waterRequirement: 'Low'
        },
        plantationDetails: {
            growthTimeMonths: 120,
            spacingMeters: 15,
            idealSeasons: ['Monsoon']
        },
        benefits: {
            ecological: ['Massive carbon storage', 'Biodiversity hub', 'Microclimate creation'],
            economic: ['Limited commercial value', 'Latex production'],
            social: ['National symbol', 'Cultural importance', 'Community landmark']
        },
        riskFactors: {
            drought: 'Very Low',
            fire: 'Low',
            pest: 'Very Low',
            disease: 'Very Low'
        },
        useCases: ['Forest Restoration', 'Government Projects']
    }
];
