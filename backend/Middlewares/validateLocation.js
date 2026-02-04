

export const validateLocation = (req, res, next) => {
    const { location } = req.body;

    if (!location) {
        return res.status(400).json({
            success: false,
            message: 'Location is required'
        });
    }

    if (!location.coordinates || !Array.isArray(location.coordinates)) {
        return res.status(400).json({
            success: false,
            message: 'Location must include coordinates array'
        });
    }

    if (location.coordinates.length !== 2) {
        return res.status(400).json({
            success: false,
            message: 'Coordinates must be [longitude, latitude]'
        });
    }

    const [longitude, latitude] = location.coordinates;

    if (typeof longitude !== 'number' || longitude < -180 || longitude > 180) {
        return res.status(400).json({
            success: false,
            message: 'Invalid longitude. Must be between -180 and 180'
        });
    }

    if (typeof latitude !== 'number' || latitude < -90 || latitude > 90) {
        return res.status(400).json({
            success: false,
            message: 'Invalid latitude. Must be between -90 and 90'
        });
    }

    const isWithinIndia =
        latitude >= 6 && latitude <= 38 &&
        longitude >= 68 && longitude <= 98;

    if (!isWithinIndia) {
        req.locationWarning = 'Location appears to be outside India';
    }

    if (!location.type) {
        req.body.location.type = 'Point';
    }

    next();
};

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

    req.validatedCoordinates = { longitude: lon, latitude: lat };

    next();
};

export default {
    validateLocation,
    validateCoordinatesQuery
};
