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

    static async getAllUsers() {
        try {
            const query = `SELECT u.user_id, u.user_name, u.email, u.is_banned, r.role_name
                        FROM users u, roles r
                        WHERE u.role_id = r.id
                        ORDER BY u.user_name ASC`
            const result = await db.query(query);
            return result.rows;
        }
        catch (error) {
            console.log("Error in UserModel: ", error);
        }
    }

    static async filterUsers(name_email) {
        try {
            const searchTerm = `%${name_email}%`;
            const query = `SELECT DISTINCT u.user_id, u.user_name, u.email, u.is_banned, r.role_name
                        FROM users u, roles r
                        WHERE u.role_id = r.id and (u.user_name LIKE $1 OR u.email LIKE $1)`
            const result = await db.query(query, [searchTerm]);
            return result.rows;
        } catch (error) {
            console.log('Error in userModel: ', error);
        }
    }

    static async setBanOrUnban(user_id, isBanned) {
        try {
            const query = `UPDATE users 
                        SET is_banned = $1
                        WHERE user_id = $2
                        RETURNING *`;

            const result = await db.query(query, [isBanned, user_id]);
            return result.rows.length > 0;
        } catch (error) {
            console.log('Error in userModel: ', error);
        }
    }

}

module.exports = UserModel;
