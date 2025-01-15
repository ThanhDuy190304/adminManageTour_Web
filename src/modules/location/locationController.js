const LocationService = require('./locationService');

class LocationController {
    static async getAllLocations(req, res) {
        try {
            const result = await LocationService.getAllLocations();
            return res.status(200).json({ data: result });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    static async postLocation(req, res) {
        const { name, details } = req.body;
        try {
            const result = await LocationService.postLocation(name, details);
            if (!result) {
                return res.status(400).json({ error: "Failed to add location" });
            }
            return res.status(201).json({ data: result });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    static async patchLocation(req, res) {
        const { locationId } = req.params;
        const updates = req.body;
        if (!updates || Object.keys(updates).length < 1) {
            return res.status(400).json({ error: "No fields to update provided" });
        }
        const fields = Object.keys(updates);
        const allowedFields = ['location_name', 'details'];
        const isValidOperation = fields.every(field => allowedFields.includes(field));
        if (!isValidOperation) {
            return res.status(400).json({ error: "Invalid fields to update" });
        }
        try {
            const result = await LocationService.patchLocation(locationId, updates);
            if (!result) {
                return res.status(404).json({ error: "Location not found" });
            }
            return res.status(200).json({ data: result });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    static async deleteLocation(req, res) {
        const { locationId } = req.params;
        try {
            const result = await LocationService.deleteLocation(locationId);
            if (!result) {
                return res.status(404).json({ error: "Location not found" });
            }
            return res.status(200).json({ data: result });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}
module.exports = LocationController;