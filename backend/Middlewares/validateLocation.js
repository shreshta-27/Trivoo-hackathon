/**
 * Location Validation Middleware
 * Validates GeoJSON coordinates and location data
 */

/**
 * Validate GeoJSON Point coordinates
 */
export const validateLocation = (req, res, next) => {
    const { location } = req.body;

    if (!location) {
        return res.status(400).json({
            success: false,
            message: 'Location is required'
        });
    }

    // Check if coordinates exist
    if (!location.coordinates || !Array.isArray(location.coordinates)) {
        return res.status(400).json({
            success: false,
            message: 'Location must include coordinates array'
        });
    }

    // Validate coordinates length
    if (location.coordinates.length !== 2) {
        return res.status(400).json({
            success: false,
            message: 'Coordinates must be [longitude, latitude]'
        });
    }

    const [longitude, latitude] = location.coordinates;

    // Validate longitude range
    if (typeof longitude !== 'number' || longitude < -180 || longitude > 180) {
        return res.status(400).json({
            success: false,
            message: 'Invalid longitude. Must be between -180 and 180'
        });
    }

    // Validate latitude range
    if (typeof latitude !== 'number' || latitude < -90 || latitude > 90) {
        return res.status(400).json({
            success: false,
            message: 'Invalid latitude. Must be between -90 and 90'
        });
    }

    // Optionally validate if location is within India (for this specific use case)
    // India approximate bounds: Lat 8-37, Long 68-97
    const isWithinIndia =
        latitude >= 6 && latitude <= 38 &&
        longitude >= 68 && longitude <= 98;

    if (!isWithinIndia) {
        req.locationWarning = 'Location appears to be outside India';
    }

    // Set type to Point if not specified
    if (!location.type) {
        req.body.location.type = 'Point';
    }

    next();
};

/**
 * Validate coordinates from query parameters
 */
export const validateCoordinatesQuery = (req, res, next) => {
    const { longitude, latitude } = req.query;

    if (!longitude || !latitude) {
        return res.status(400).json({
            success: false,
            message: 'Both longitude and latitude are required'
        });
    }

    const lon = parseFloat(longitude);
    const lat = parseFloat(latitude);

    if (isNaN(lon) || lon < -180 || lon > 180) {
        return res.status(400).json({
            success: false,
            message: 'Invalid longitude. Must be between -180 and 180'
        });
    }

    if (isNaN(lat) || lat < -90 || lat > 90) {
        return res.status(400).json({
            success: false,
            message: 'Invalid latitude. Must be between -90 and 90'
        });
    }

    // Attach validated coordinates to request
    req.validatedCoordinates = { longitude: lon, latitude: lat };

    next();
};

export default {
    validateLocation,
    validateCoordinatesQuery
};
