import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import { MapPin, Layers, Info, AlertTriangle } from 'lucide-react';

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
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [mapReady, setMapReady] = useState(false);
    const [isSatelliteView, setIsSatelliteView] = useState(false);

    const regions = [
        {
            id: 1,
            name: 'Amazon Rainforest',
            coordinates: [-3.4653, -62.2159],
            projects: 12,
            atRisk: 2,
            status: 'warning',
            description: 'Monitoring deforestation and biodiversity',
            patchSize: 2000, // 2km radius in meters
        },
        {
            id: 2,
            name: 'Great Barrier Reef',
            coordinates: [-18.2871, 147.6992],
            projects: 8,
            atRisk: 1,
            status: 'stable',
            description: 'Coral bleaching and marine ecosystem health',
            patchSize: 2000,
        },
        {
            id: 3,
            name: 'Arctic Circle',
            coordinates: [66.5639, -45.6469],
            projects: 6,
            atRisk: 3,
            status: 'critical',
            description: 'Ice melt and climate change monitoring',
            patchSize: 2000,
        },
        {
            id: 4,
            name: 'Congo Basin',
            coordinates: [-0.7264, 22.4784],
            projects: 10,
            atRisk: 0,
            status: 'healthy',
            description: 'Rainforest conservation and wildlife protection',
            patchSize: 2000,
        },
        {
            id: 5,
            name: 'Himalayan Region',
            coordinates: [28.5983, 83.9956],
            projects: 7,
            atRisk: 1,
            status: 'stable',
            description: 'Glacier monitoring and air quality',
            patchSize: 2000,
        },
        {
            id: 6,
            name: 'Pacific Islands',
            coordinates: [-17.6509, -149.4260],
            projects: 5,
            atRisk: 0,
            status: 'healthy',
            description: 'Sea level rise and coastal erosion',
            patchSize: 2000,
        },
    ];

    useEffect(() => {
        import('leaflet/dist/leaflet.css');

        import('leaflet').then((L) => {
            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            });
            setMapReady(true);
        });

        if (region) {
            const regionData = regions.find((r) => r.id === parseInt(region));
            if (regionData) {
                setSelectedRegion(regionData);
            }
        }
    }, [region]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'critical':
                return '#ef4444';
            case 'warning':
                return '#f59e0b';
            case 'stable':
                return '#3b82f6';
            case 'healthy':
                return '#10b981';
            default:
                return '#6b7280';
        }
    };

    const getCircleColor = (status) => {
        switch (status) {
            case 'critical':
                return { color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.2 };
            case 'warning':
                return { color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.2 };
            case 'stable':
                return { color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.2 };
            case 'healthy':
                return { color: '#10b981', fillColor: '#10b981', fillOpacity: 0.2 };
            default:
                return { color: '#6b7280', fillColor: '#6b7280', fillOpacity: 0.2 };
        }
    };

    const defaultCenter = [20, 0];
    const defaultZoom = 2;

    const mapCenter = selectedRegion ? selectedRegion.coordinates : defaultCenter;
    const mapZoom = selectedRegion ? 6 : defaultZoom;

    return (
        <DashboardLayout activePage="map-view">
            <div style={{ maxWidth: '100%', height: 'calc(100vh - 4rem)' }}>
                {}
                <motion.div
                    style={{ marginBottom: '1.5rem' }}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
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
                        Global Map View
                    </h1>
                    <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
                        Interactive monitoring of environmental regions worldwide
                    </p>
                </motion.div>

                {}
                <motion.div
                    className="glass-card"
                    style={{
                        height: 'calc(100% - 100px)',
                        padding: '1rem',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    {}
                    <motion.div
                        style={{
                            position: 'absolute',
                            top: '1.5rem',
                            right: '1.5rem',
                            zIndex: 1000,
                            display: 'flex',
                            gap: '0.5rem',
                        }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <motion.button
                            onClick={() => setIsSatelliteView(false)}
                            style={{
                                padding: '0.75rem 1.25rem',
                                borderRadius: '10px',
                                background: !isSatelliteView
                                    ? 'linear-gradient(135deg, var(--emerald-green), var(--bright-green))'
                                    : 'rgba(255, 255, 255, 0.1)',
                                border: !isSatelliteView ? 'none' : '1px solid var(--glass-border)',
                                color: !isSatelliteView ? '#ffffff' : 'var(--text-secondary)',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                backdropFilter: 'blur(10px)',
                                boxShadow: !isSatelliteView ? '0 4px 16px rgba(16, 185, 129, 0.4)' : 'none',
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Standard
                        </motion.button>
                        <motion.button
                            onClick={() => setIsSatelliteView(true)}
                            style={{
                                padding: '0.75rem 1.25rem',
                                borderRadius: '10px',
                                background: isSatelliteView
                                    ? 'linear-gradient(135deg, var(--emerald-green), var(--bright-green))'
                                    : 'rgba(255, 255, 255, 0.1)',
                                border: isSatelliteView ? 'none' : '1px solid var(--glass-border)',
                                color: isSatelliteView ? '#ffffff' : 'var(--text-secondary)',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                backdropFilter: 'blur(10px)',
                                boxShadow: isSatelliteView ? '0 4px 16px rgba(16, 185, 129, 0.4)' : 'none',
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Satellite
                        </motion.button>
                    </motion.div>

                    {mapReady ? (
                        <MapContainer
                            center={mapCenter}
                            zoom={mapZoom}
                            style={{
                                height: '100%',
                                width: '100%',
                                borderRadius: '12px',
                                zIndex: 1,
                            }}
                            scrollWheelZoom={true}
                        >
                            {}
                            {isSatelliteView ? (
                                <TileLayer
                                    attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                                />
                            ) : (
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                            )}

                            {}
                            {regions.map((region) => {
                                const circleStyle = getCircleColor(region.status);
                                return (
                                    <div key={region.id}>
                                        {}
                                        <Circle
                                            center={region.coordinates}
                                            radius={region.patchSize}
                                            pathOptions={{
                                                color: circleStyle.color,
                                                fillColor: circleStyle.fillColor,
                                                fillOpacity: circleStyle.fillOpacity,
                                                weight: 2,
                                            }}
                                        />

                                        {}
                                        <Marker
                                            position={region.coordinates}
                                            eventHandlers={{
                                                click: () => setSelectedRegion(region),
                                            }}
                                        >
                                            <Popup>
                                                <div style={{ minWidth: '200px' }}>
                                                    <h3
                                                        style={{
                                                            fontSize: '1.125rem',
                                                            fontWeight: '600',
                                                            color: '#0F172A',
                                                            marginBottom: '0.5rem',
                                                        }}
                                                    >
                                                        {region.name}
                                                    </h3>
                                                    <p
                                                        style={{
                                                            fontSize: '0.875rem',
                                                            color: '#64748b',
                                                            marginBottom: '0.75rem',
                                                        }}
                                                    >
                                                        {region.description}
                                                    </p>
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            gap: '1rem',
                                                            marginBottom: '0.75rem',
                                                        }}
                                                    >
                                                        <div>
                                                            <p
                                                                style={{
                                                                    fontSize: '0.75rem',
                                                                    color: '#94a3b8',
                                                                }}
                                                            >
                                                                Projects
                                                            </p>
                                                            <p
                                                                style={{
                                                                    fontSize: '1.25rem',
                                                                    fontWeight: '600',
                                                                    color: '#10b981',
                                                                }}
                                                            >
                                                                {region.projects}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p
                                                                style={{
                                                                    fontSize: '0.75rem',
                                                                    color: '#94a3b8',
                                                                }}
                                                            >
                                                                At Risk
                                                            </p>
                                                            <p
                                                                style={{
                                                                    fontSize: '1.25rem',
                                                                    fontWeight: '600',
                                                                    color: region.atRisk > 0 ? '#f59e0b' : '#10b981',
                                                                }}
                                                            >
                                                                {region.atRisk}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div
                                                        style={{
                                                            display: 'inline-block',
                                                            padding: '0.25rem 0.75rem',
                                                            borderRadius: '6px',
                                                            background: `${getStatusColor(region.status)}20`,
                                                            color: getStatusColor(region.status),
                                                            fontSize: '0.75rem',
                                                            fontWeight: '600',
                                                            textTransform: 'uppercase',
                                                        }}
                                                    >
                                                        {region.status}
                                                    </div>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    </div>
                                );
                            })}
                        </MapContainer>
                    ) : (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                color: 'var(--text-secondary)',
                            }}
                        >
                            <div className="spinner"></div>
                        </div>
                    )}

                    {}
                    <motion.div
                        style={{
                            position: 'absolute',
                            bottom: '2rem',
                            right: '2rem',
                            background: 'rgba(15, 23, 42, 0.9)',
                            backdropFilter: 'blur(20px)',
                            padding: '1rem',
                            borderRadius: '12px',
                            border: '1px solid var(--glass-border)',
                            zIndex: 1000,
                            minWidth: '200px',
                        }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            <Layers style={{ width: '16px', height: '16px', color: 'var(--emerald-green)' }} />
                            <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                                Legend
                            </h4>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div
                                    style={{
                                        width: '12px',
                                        height: '12px',
                                        borderRadius: '50%',
                                        background: '#10b981',
                                    }}
                                ></div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Healthy</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div
                                    style={{
                                        width: '12px',
                                        height: '12px',
                                        borderRadius: '50%',
                                        background: '#3b82f6',
                                    }}
                                ></div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Stable</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div
                                    style={{
                                        width: '12px',
                                        height: '12px',
                                        borderRadius: '50%',
                                        background: '#f59e0b',
                                    }}
                                ></div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Warning</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div
                                    style={{
                                        width: '12px',
                                        height: '12px',
                                        borderRadius: '50%',
                                        background: '#ef4444',
                                    }}
                                ></div>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Critical</span>
                            </div>
                            <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--glass-border)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Info style={{ width: '12px', height: '12px', color: 'var(--text-muted)' }} />
                                    <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>
                                        Circle = 2km radius
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
