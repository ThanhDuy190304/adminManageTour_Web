const db = require('../../config/db');

class OrderManagementModel {
    static async getReservations() {
        try {
            const query = 'SELECT reservation_id, tourist_id, reservation_date, status, tourist_contact, tourist_name FROM reservations';
            const result = await db.query(query);
            if (result.rows.length > 0) {
                return result.rows.map(row => {
                    return {
                        reservationId: row.reservation_id,
                        touristId: row.tourist_id,
                        reservationDate: row.reservation_date,
                        status: row.status,
                        touristContact: row.tourist_contact,
                        touristName: row.tourist_name
                    };
                });
            }
            return null;
        } catch (error) {
            console.error('Erorr in OrderManagementMode.getReservation', error.message);
            throw error;
        }
    }

    static async updateReservationStatus(reservationId, status) {
        try {
            const query = 'UPDATE reservations SET status = $1 WHERE reservation_id = $2';
            const values = [status, reservationId];
            await db.query(query, values);
        } catch (error) {
            console.error('Error in OrderManagementModel.updateReservationStatus:', error.message);
            throw error;
        }
    }

    static async getDetailReservation(reservationId) {
        try {
            const query = `
            SELECT dr.detail_reservation_id, dr.tittle, dr.quantity, dr.total_price, dr.tourdate, dr.tour_img,
                   m.id, m.name, m.contact
            FROM detail_reservations dr
            LEFT JOIN detail_tours dt ON dr.tour_id = dt.tour_id AND dr.detail_tour_id = dt.detail_tour_id
            LEFT JOIN tours t ON dr.tour_id = t.tour_id
            JOIN manufacturers m ON t.manufacturer_id = m.id
            WHERE dr.reservation_id = $1
        `;
            const result = await db.query(query, [reservationId]);
            if (result.rows.length > 0) {
                return result.rows.map(row => {
                    return {
                        detailReservationId: row.detail_reservation_id,
                        title: row.tittle,
                        quantity: row.quantity,
                        totalPrice: row.total_price,
                        tourDate: row.tourdate,
                        tourImg: row.tour_img,
                        manufacturerId: row.id,
                        manufacturerName: row.name,
                        manufacturerContact: row.contact
                    };
                });
            }
            return null;
        } catch (error) {
            console.error('Error in OrderManagementModel.getDetailReservation:', error.message);
            throw error;
        }
    }
}


module.exports = OrderManagementModel;