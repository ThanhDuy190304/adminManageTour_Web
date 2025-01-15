const locationModel = require('./locationModel');

class LocationService {
    static async getAllLocations() {
        const allLocations = await locationModel.getAllLocations();
        if (!allLocations) return null;
        return allLocations;
    }
    static async postLocation(locationName, locationDetails) {
        const newLocation = await locationModel.postLocation(locationName, locationDetails);
        if (!newLocation) return null;
        return newLocation;
    }
    static async patchLocation(locationId, updates) {
        const updatedLocation = await locationModel.patchLocation(locationId, updates);
        if (!updatedLocation) return null;
        return updatedLocation;
    }
    static async deleteLocation(locationId) {
        const deletedLocation = await locationModel.deleteLocation(locationId);
        if (!deletedLocation) return null;
        return deletedLocation;
    }
}

module.exports = LocationService;