const db = require('../../config/db');

class reportByIncomeModel {

    static async moneyStatisticByYear(sortByValue, orderValue) {
        try {
            const query = `
                SELECT 
                    SUM(dr.total_price) AS total_money, 
                    EXTRACT(YEAR FROM r.reservation_date) AS time
                FROM 
                    detail_reservations dr
                JOIN 
                    reservations r ON dr.reservation_id = r.reservation_id
                GROUP BY 
                    time
                ORDER BY 
                    ${sortByValue} ${orderValue}
            `;
                
            const result = await db.query(query, []);
            return result.rows;
        } catch (error) {
            console.log('Error in moneyStatisticByYear:', error);
        }
    }

    static async moneyStatisticByMonth(sortByValue, orderValue) {
        try {
            const query = `
                SELECT 
                    SUM(dr.total_price) AS total_money, 
                    CONCAT(
                        LPAD(EXTRACT(MONTH FROM r.reservation_date)::TEXT, 2, '0'), '/', 
                        EXTRACT(YEAR FROM r.reservation_date)::TEXT
                    ) AS time
                FROM 
                    detail_reservations dr
                JOIN 
                    reservations r ON dr.reservation_id = r.reservation_id
                GROUP BY 
                    time
                ORDER BY 
                    ${sortByValue} ${orderValue}
            `;

            const result = await db.query(query, []);
            return result.rows;
        } catch (error) {
            console.log('Error in moneyStatisticByMonth:', error);
        }
    }

    static async moneyStatisticByDay(sortByValue, orderValue) {
        try {
            const query = `
                SELECT 
                    SUM(dr.total_price) AS total_money, 
                    CONCAT(
                        LPAD(EXTRACT(DAY FROM r.reservation_date)::TEXT, 2, '0'), '/', 
                        LPAD(EXTRACT(MONTH FROM r.reservation_date)::TEXT, 2, '0'), '/', 
                        EXTRACT(YEAR FROM r.reservation_date)::TEXT
                    ) AS time
                FROM 
                    detail_reservations dr
                JOIN 
                    reservations r ON dr.reservation_id = r.reservation_id
                GROUP BY 
                    time
                ORDER BY 
                    ${sortByValue} ${orderValue}
            `;
                
            const result = await db.query(query, []);
            return result.rows;
        } catch (error) {
            console.log('Error in moneyStatisticByDay:', error);
        }
    }
}

module.exports = reportByIncomeModel;
