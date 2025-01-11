const OrderManagementService = require('./orderManagementService');
class OrderManagementController {
    static async getReservations(req, res) {
        try {
            const result = await OrderManagementService.getReservations();
            return res.status(200).json({ data: result });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    static async updateReservationStatus(req, res) {
        const { reservationId, status } = req.body;
        try {
            await OrderManagementService.updateReservationStatus(reservationId, status);
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    static async getDetailReservation(req, res) {
        const reservationId = req.params.reservationId;
        try {
            const result = await OrderManagementService.getDetailReservation(reservationId);
            return res.status(200).json({ data: result });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}
module.exports = OrderManagementController;