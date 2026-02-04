
export const geocodeLocation = async (locationText) => {
    const locationMap = {
        'nashik': { lat: 19.9975, lon: 73.7898, type: 'city' },
        'pune': { lat: 18.5204, lon: 73.8567, type: 'city' },
        'mumbai': { lat: 19.0760, lon: 72.8777, type: 'city' },
        'marathwada': { lat: 19.8762, lon: 75.3433, type: 'region' },
        'western ghats': { lat: 14.0, lon: 74.5, type: 'region' }, // Approximate center
        'satara': { lat: 17.6805, lon: 74.0183, type: 'city' },
        'nagpur': { lat: 21.1458, lon: 79.0882, type: 'city' }
    };

    const lowerText = locationText.toLowerCase();

    for (const [key, coords] of Object.entries(locationMap)) {
        if (lowerText.includes(key)) {
            return {
                found: true,
                coordinates: [coords.lon, coords.lat], // GeoJSON is [lon, lat]
                formattedAddress: `${key.charAt(0).toUpperCase() + key.slice(1)}, India`,
                type: coords.type
            };
        }
    }

    return { found: false };
};

export default {
    geocodeLocation
};
