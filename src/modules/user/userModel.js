const db = require('../../config/db');

class UserModel {
    static async getNumberOfUser() {
        const query = `SELECT 
                            COUNT(DISTINCT t.tourist_id) + COUNT(DISTINCT a.admin_id) AS total,
                            COUNT(DISTINCT t.tourist_id) AS total_tourists,
                            COUNT(DISTINCT a.admin_id) AS total_admins
                        FROM 
                            users u
                        LEFT JOIN tourists t ON u.user_id = t.user_id
                        LEFT JOIN admins a ON u.user_id = a.user_id;`;

        try {
            const result = await db.query(query);
            return result.rows[0];
        } catch (err) {
            console.log("Error in userModel", err);
        }
        return null;
    }
}

module.exports = UserModel;
