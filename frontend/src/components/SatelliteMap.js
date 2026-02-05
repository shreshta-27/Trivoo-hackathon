import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function SatelliteMap({ area, coverageIntensity, scenarioColor }) {
    useEffect(() => {
        // Create map
        const map = L.map('satellite-map', {
            zoomControl: false,
            attributionControl: false,
        }).setView([area.lat, area.lng], 12);

        // Add satellite tile layer
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            maxZoom: 19,
        }).addTo(map);

        // Add green coverage overlay
        if (coverageIntensity > 0) {
            const overlayPane = map.createPane('overlay');
            overlayPane.style.zIndex = 400;
            overlayPane.style.pointerEvents = 'none';

            const bounds = map.getBounds();
            const center = map.getCenter();

            // Create a circle overlay for green coverage
            const radius = 5000 * coverageIntensity; // Scale radius based on intensity
            const circle = L.circle(center, {
                color: scenarioColor,
                fillColor: scenarioColor,
                fillOpacity: coverageIntensity * 0.4,
                radius: radius,
                pane: 'overlay',
                stroke: false,
            }).addTo(map);
        }

        // Cleanup
        return () => {
            map.remove();
        };
    }, [area, coverageIntensity, scenarioColor]);

    return (
        <div
            id="satellite-map"
            style={{
                width: '100%',
                height: '100%',
                borderRadius: '12px',
                overflow: 'hidden',
            }}
        />
    );
}
