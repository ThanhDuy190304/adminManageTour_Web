const OrderManagementModel = require('./orderManagementModel');

class OrderManagementService {
    static async getReservations() {
        const result = await OrderManagementModel.getReservations();
        if (!result) return [];
        return result.map(row => {
            const reservationDate = new Date(row.reservationDate);
            const formattedDate = reservationDate.toLocaleString('vi-VN');
            return {
                reservationId: row.reservationId,
                touristId: row.touristId,
                reservationDate: formattedDate,
                status: row.status,
                touristContact: row.touristContact,
                touristName: row.touristName
            };
        });
    }
    static async updateReservationStatus(reservationId, status) {
        await OrderManagementModel.updateReservationStatus(reservationId, status);
    }
    static async getDetailReservation(reservationId) {
        const result = await OrderManagementModel.getDetailReservation(reservationId);
        if (!result) return [];
        return result.map(row => {
            const tourDate = new Date(row.tourDate);
            const formattedDate = tourDate.toLocaleString('vi-VN');
            return {
                detailReservationId: row.detailReservationId,
                title: row.title,
                quantity: row.quantity,
                totalPrice: row.totalPrice,
                tourDate: formattedDate,
                tourImg: row.tourImg,
                manufacturerId: row.manufacturerId,
                manufacturerName: row.manufacturerName
            };
        });
    }
}
module.exports = OrderManagementService;
