const db = require('../../config/db');

class LocationModel {
    static async getAllLocations() {
        try {
            const allLocations = await db.query('SELECT location_id, location_name, details FROM locations');
            if (allLocations.rows.length < 1) return null;
            const mappedLocations = allLocations.rows.map(location => ({
                id: location.location_id,
                name: location.location_name,
                details: location.details,
            }));
            return mappedLocations;
        } catch (err) {
            console.error("Error in LocationModel.getAllLocations: ", err.message);
            throw err;
        }
    }
    static async postLocation(locationName, locationDetails) {
        try {
            const newLocation = await db.query('INSERT INTO locations (location_name, details) VALUES ($1, $2) RETURNING *', [locationName, locationDetails]);
            if (newLocation.rows.length < 1) return null;
            return newLocation;
        } catch (err) {
            console.error("Error in LocationModel.postLocation: ", err.message);
            throw err;
        }
    }
    static async patchLocation(locationId, updates) {
        try {
            const fields = [];
            const values = [];
            let query = 'UPDATE locations SET ';
            Object.keys(updates).forEach((key, index) => {
                fields.push(`${key} = $${index + 1}`);
                values.push(updates[key]);
            });
            query += fields.join(', ') + ' WHERE location_id = $' + (fields.length + 1) + ' RETURNING *';
            values.push(locationId);
            const updatedLocation = await db.query(query, values);
            if (updatedLocation.rows.length < 1) return null;
            return updatedLocation.rows[0];
        } catch (err) {
            console.error("Error in LocationModel.patchLocation: ", err.message);
            throw err;
        }
    }
    static async deleteLocation(locationId) {
        try {
            const deletedLocation = await db.query('DELETE FROM locations WHERE location_id = $1 RETURNING *', [locationId]);
            if (deletedLocation.rows.length < 1) return null;
            return deletedLocation.rows[0];
        } catch (err) {
            console.error("Error in LocationModel.deleteLocation: ", err.message);
            throw err;
        }
    }
}

module.exports = LocationModel;
