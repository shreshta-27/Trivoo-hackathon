import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import { MapPin, Layers, Info, AlertTriangle } from 'lucide-react';
import { map } from '../utils/api';

// Dynamic import for Leaflet to avoid SSR issues
const MapContainer = dynamic(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
);
const Marker = dynamic(
    () => import('react-leaflet').then((mod) => mod.Marker),
    { ssr: false }
);
const Popup = dynamic(
    () => import('react-leaflet').then((mod) => mod.Popup),
    { ssr: false }
);
const Circle = dynamic(
    () => import('react-leaflet').then((mod) => mod.Circle),
    { ssr: false }
);

export default function MapView() {
    const router = useRouter();
    const { region } = router.query;
    const [regions, setRegions] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [mapReady, setMapReady] = useState(false);
    const [isSatelliteView, setIsSatelliteView] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Import Leaflet CSS
        import('leaflet/dist/leaflet.css');

        // Fix for default marker icons in Next.js
        import('leaflet').then((L) => {
            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            });
            setMapReady(true);
        });

        fetchMapData();
    }, []);

    const fetchMapData = async () => {
        try {
            setLoading(true);
            const res = await map.getData();
            if (res.data?.data && res.data.data.length > 0) {
                const mappedRegions = res.data.data.map(r => ({
                    id: r.id,
                    name: r.name,
                    coordinates: r.coordinates || [0, 0], // Ensure valid coords
                    projects: r.projectCount,
                    atRisk: r.projects ? r.projects.filter(p => p.riskLevel === 'critical' || p.riskLevel === 'high').length : 0,
                    status: r.riskLevel === 'critical_stress' ? 'critical' : r.riskLevel === 'high_stress' ? 'warning' : 'stable', // Mapping logic
                    description: r.metadata?.description || `Region monitoring ${r.projectCount} projects`,
                    patchSize: 200000,
                }));
                setRegions(mappedRegions);
            } else {
                throw new Error("No data returned");
            }
        } catch (error) {
            console.error("Failed to fetch map data, using fallback", error);
            // Fallback Data for Demo
            setRegions([
                {
                    id: 1,
                    name: "Amazon Rainforest",
                    coordinates: [-3.4653, -62.2159],
                    projects: 12,
                    atRisk: 2,
                    status: "warning",
                    description: "Major reforestation initiative in the Amazon basin.",
                    patchSize: 200000
                },
                {
                    id: 2,
                    name: "Central Africa",
                    coordinates: [1.6, 23.5], // Congo Basin
                    projects: 8,
                    atRisk: 1,
                    status: "stable",
                    description: "Community-driven agroforestry projects.",
                    patchSize: 200000
                },
                {
                    id: 3,
                    name: "Southeast Asia",
                    coordinates: [1.3, 113.9], // Borneo
                    projects: 5,
                    atRisk: 3,
                    status: "critical",
                    description: "Peatland restoration and critical habitat protection.",
                    patchSize: 200000
                },
                {
                    id: 4,
                    name: "Western Europe",
                    coordinates: [46.2, 2.2], // France
                    projects: 15,
                    atRisk: 0,
                    status: "healthy",
                    description: "Urban greening and sustainable forestry.",
                    patchSize: 150000
                },
                {
                    id: 5,
                    name: "Western Ghats",
                    coordinates: [14.0, 75.0], // India (Maharashtra/Karnataka)
                    projects: 18,
                    atRisk: 4,
                    status: "critical",
                    description: "Biodiversity hotspot in India facing urbanization threats.",
                    patchSize: 180000
                },
                {
                    id: 6,
                    name: "Sundarbans Mangroves",
                    coordinates: [21.9, 88.9], // India/Bangladesh
                    projects: 9,
                    atRisk: 2,
                    status: "warning",
                    description: "Critical mangrove ecosystem protecting coastal areas.",
                    patchSize: 160000
                },
                {
                    id: 7,
                    name: "Mumbai Urban Forest",
                    coordinates: [19.0760, 72.8777], // Mumbai, Maharashtra
                    projects: 6,
                    atRisk: 1,
                    status: "stable",
                    description: "Aarey Colony and urban green cover initiatives.",
                    patchSize: 100000
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (region && regions.length > 0) {
            const regionData = regions.find((r) => r.id === region || r.id === parseInt(region));
            if (regionData) {
                setSelectedRegion(regionData);
            }
        }
    }, [region, regions]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'critical': return '#ef4444';
            case 'warning': return '#f59e0b';
            case 'stable': return '#3b82f6';
            case 'healthy': return '#10b981';
            default: return '#6b7280';
        }
    };

    const getCircleColor = (status) => {
        switch (status) {
            case 'critical': return { color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.2 };
            case 'warning': return { color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.2 };
            case 'stable': return { color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.2 };
            case 'healthy': return { color: '#10b981', fillColor: '#10b981', fillOpacity: 0.2 };
            default: return { color: '#6b7280', fillColor: '#6b7280', fillOpacity: 0.2 };
        }
    };

    const defaultCenter = [20, 0];
    const defaultZoom = 2;
    const mapCenter = selectedRegion ? selectedRegion.coordinates : defaultCenter;
    const mapZoom = selectedRegion ? 6 : defaultZoom;

    return (
        <DashboardLayout activePage="map-view">
            <div className="h-[calc(100vh-4rem)] w-full flex flex-col">
                {/* Header */}
                <motion.div
                    className="mb-6 px-4 sm:px-0"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-br from-white to-emerald-400">
                        Global Map View
                    </h1>
                    <p className="text-base text-gray-400">
                        Interactive monitoring of environmental regions worldwide
                    </p>
                </motion.div>

                {/* Map Container */}
                <motion.div
                    className="glass-card flex-1 p-4 relative overflow-hidden rounded-xl mx-4 sm:mx-0 mb-4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    {/* Map View Toggle Button */}
                    <motion.div
                        className="absolute top-6 right-6 z-[1000] flex gap-2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <motion.button
                            onClick={() => setIsSatelliteView(false)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold backdrop-blur-md transition-all ${!isSatelliteView ? 'bg-gradient-to-br from-emerald-500 to-green-400 text-white shadow-lg shadow-emerald-500/40' : 'bg-white/10 text-gray-300 border border-white/10'}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Standard
                        </motion.button>
                        <motion.button
                            onClick={() => setIsSatelliteView(true)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold backdrop-blur-md transition-all ${isSatelliteView ? 'bg-gradient-to-br from-emerald-500 to-green-400 text-white shadow-lg shadow-emerald-500/40' : 'bg-white/10 text-gray-300 border border-white/10'}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Satellite
                        </motion.button>
                    </motion.div>

                    {mapReady && !loading ? (
                        <MapContainer
                            center={mapCenter}
                            zoom={mapZoom}
                            className="h-full w-full rounded-lg z-0"
                            scrollWheelZoom={true}
                            key={selectedRegion ? selectedRegion.id : 'world'} // Force re-render on region change
                        >
                            {isSatelliteView ? (
                                <TileLayer
                                    attribution='Tiles &copy; Esri'
                                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                                />
                            ) : (
                                <TileLayer
                                    attribution='&copy; OpenStreetMap & CARTO'
                                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                />
                            )}

                            {regions.map((r) => {
                                const circleStyle = getCircleColor(r.status);
                                return (
                                    <div key={r.id}>
                                        <Circle
                                            center={r.coordinates}
                                            radius={r.patchSize}
                                            pathOptions={{
                                                color: circleStyle.color,
                                                fillColor: circleStyle.fillColor,
                                                fillOpacity: circleStyle.fillOpacity,
                                                weight: 2,
                                            }}
                                        />
                                        <Marker
                                            position={r.coordinates}
                                            eventHandlers={{
                                                click: () => setSelectedRegion(r),
                                            }}
                                        >
                                            <Popup>
                                                <div className="min-w-[200px]">
                                                    <h3 className="text-lg font-bold text-slate-900 mb-2">{r.name}</h3>
                                                    <p className="text-sm text-slate-500 mb-3">{r.description}</p>
                                                    <div className="flex gap-4 mb-3">
                                                        <div>
                                                            <p className="text-xs text-slate-400">Projects</p>
                                                            <p className="text-xl font-bold text-emerald-500">{r.projects}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-slate-400">At Risk</p>
                                                            <p className={`text-xl font-bold ${r.atRisk > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
                                                                {r.atRisk}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className={`inline-block px-3 py-1 rounded-md text-xs font-bold uppercase bg-${getStatusColor(r.status)} bg-opacity-20 text-[${getStatusColor(r.status)}]`}>
                                                        {r.status}
                                                    </div>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    </div>
                                );
                            })}
                        </MapContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                style={{ borderTopColor: 'transparent' }}
                                className="w-12 h-12 border-4 border-emerald-500 rounded-full"
                            />
                        </div>
                    )}

                    <motion.div
                        className="absolute bottom-8 right-8 bg-slate-900/90 backdrop-blur-xl p-4 rounded-xl border border-white/10 z-[1000] min-w-[200px]"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <Layers className="w-4 h-4 text-emerald-500" />
                            <h4 className="text-sm font-semibold text-white">Legend</h4>
                        </div>
                        <div className="space-y-2">
                            {[
                                { color: '#10b981', label: 'Healthy' },
                                { color: '#3b82f6', label: 'Stable' },
                                { color: '#f59e0b', label: 'Warning' },
                                { color: '#ef4444', label: 'Critical' },
                            ].map((item) => (
                                <div key={item.label} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                                    <span className="text-xs text-gray-400">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
