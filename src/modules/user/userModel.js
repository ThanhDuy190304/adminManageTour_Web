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

    static async getCountFilterUser(name_email){
        try {
            const searchTerm = `%${name_email}%`;
            const query = `SELECT COUNT(u.user_id) AS count_users
                        FROM users u, roles r
                        WHERE u.role_id = r.id and (u.user_name LIKE $1 OR u.email LIKE $1)`
            const result = await db.query(query, [searchTerm]);
            console.log("model: ",result.rows[0]);
            return result.rows[0];
        } catch (error) {
            console.log('Error in userModel: ', error);
        }
    }

    static async getAllUsers(sortBy, order, page) {
        try {
            const query = `SELECT u.user_id, u.user_name, u.email, u.is_banned, r.role_name
                        FROM users u, roles r
                        WHERE u.role_id = r.id
                        ORDER BY ${sortBy} ${order}
                        LIMIT 2 OFFSET ${(page-1)*2}`
            const result = await db.query(query);
            return result.rows;
        }
        catch (error) {
            console.log("Error in UserModel: ", error);
        }
    }

    static async filterUsers(name_email, sortBy, order, page) {
        try {
            const searchTerm = `%${name_email}%`;
            const query = `SELECT DISTINCT u.user_id, u.user_name, u.email, u.is_banned, r.role_name
                        FROM users u, roles r
                        WHERE u.role_id = r.id and (u.user_name LIKE $1 OR u.email LIKE $1)
                        ORDER BY ${sortBy} ${order}
                        LIMIT 2 OFFSET ${(page-1)*2}`
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

    static async getProfileUser(userId) {
        const query = `SELECT u.email, p_u.user_fullname, p_u.user_birthdate, p_u.user_contact, p_u.user_address, p_u.avatar
                   FROM users u 
                   JOIN profile_users p_u ON u.user_id = p_u.user_id 
                   WHERE u.user_id = $1`; // Thêm điều kiện lọc theo userId

        try {
            const result = await db.query(query, [userId]);

            if (result.rows[0]) {
                const userProfile = result.rows[0];  // Lấy dữ liệu từ kết quả query
                const profileUser = {
                    fullname: userProfile.user_fullname,
                    email: userProfile.email,
                    birthdate: userProfile.user_birthdate,
                    contact: userProfile.user_contact,
                    address: userProfile.user_address,
                    avatar: userProfile.avatar,
                };
                return profileUser;
            }
        } catch (err) {
            console.log("Error in userModel", err);
        }
        return null;
    }

    static async updatePassword(userId, hashedPassword, salt) {
        try {
            const query = 'UPDATE users SET user_password = $1, salt = $2 WHERE user_id = $3';
            await db.query(query, [hashedPassword, salt, userId]);
        } catch (error) {
            console.log("Error updatePassword in userModel: ", error.message);
            throw new Error("Error updatePassword in userModel");
        }
    }

    static async updateAvatar(userId, imageUrl) {
        console.log(userId, imageUrl)
        try {
            const query = 'UPDATE profile_users SET avatar = $2 WHERE user_id = $1';
            await db.query(query, [userId, imageUrl]);
        } catch (error) {
            console.log("Error updatePassword in userModel: ", error.message);
            throw new Error("Error updatePassword in userModel");
        }
    }

    static async getAccount(userId) {
        try {
            const query = `SELECT u.email, u.user_name, u.user_password, u.salt from users u where u.user_id = $1`;
            const result = await db.query(query, [userId]);
            if (result.rows[0]) {
                return {
                    email: result.rows[0].email,
                    userName: result.rows[0].user_name,
                    userPassword: result.rows[0].user_password,
                    salt: result.rows[0].salt
                }
            }
            return null;
        } catch (error) {
            console.log("Error userModel.getAccount: ", error.message);
            throw new Error("Error userModel.getAccount");
        }
    }

    static async updateProfile(userId,fullname,birthdate,contact,address) {
        try {
            const query = `UPDATE profile_users
                            SET user_fullname = $2, user_birthdate = $3, user_contact=$4, user_address=$5
                           WHERE user_id = $1`;
            await db.query(query, [userId,fullname,birthdate,contact,address]);
        } catch (error) {
            console.error("Error create feedback in userModel: ", error);
            throw new Error("Error create feedback in userModel: ");
        }
    }
}

module.exports = UserModel;
