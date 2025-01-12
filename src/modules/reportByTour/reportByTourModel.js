const db = require('../../config/db');

class reportByTourModel {

    static async getAllTitle(){
        try{
            const query = `SELECT title
                        FROM tours t
                        ORDER BY title ASC`
            const result = await db.query(query, []);
            return result.rows;
        }
        catch(error){
            console.log('Error in getAllTitle: ', error);
        }
    }

    static async tourStatisticByYear(tour_name) {

        try {
            const query = `SELECT dr.tour_id, SUM(dr.total_price) AS money, EXTRACT(YEAR FROM dr.tourdate) AS time
                    FROM detail_reservations dr
                    WHERE dr.tittle = $1
                    GROUP BY dr.tour_id, time
                    ORDER BY money DESC`

            const result = await db.query(query, [tour_name]);
            return result.rows;
        }
        catch (error) {
            console.log('Error in tourStatisticByYear:', error);
        }
    }

    static async tourStatisticByMonth(tour_name) {
        try {
            const query = `SELECT dr.tour_id, SUM(dr.total_price) AS money, CONCAT(LPAD(EXTRACT(MONTH FROM dr.tourdate)::TEXT, 2, '0'), '/', EXTRACT(YEAR FROM dr.tourdate)::TEXT) AS time
                    FROM detail_reservations dr
                    WHERE dr.tittle = $1
                    GROUP BY dr.tour_id, time
                    ORDER BY money DESC`

            const result = await db.query(query, [tour_name]);
            return result.rows;
        }
        catch (error) {
            console.log('Error in tourStatisticByMonth:', error);
        }
    }

    static async tourStatisticByDay(tour_name) {
        try {
            const query = `SELECT dr.tour_id, SUM(dr.total_price) AS money, CONCAT(LPAD(EXTRACT(DAY FROM dr.tourdate)::TEXT, 2, '0'), '/', LPAD(EXTRACT(MONTH FROM dr.tourdate)::TEXT, 2, '0'), '/', EXTRACT(YEAR FROM dr.tourdate)::TEXT) AS time
                    FROM detail_reservations dr
                    WHERE dr.tittle = $1
                    GROUP BY dr.tour_id, time
                    ORDER BY money DESC`

            const result = await db.query(query, [tour_name]);
            return result.rows;
        }
        catch (error) {
            console.log('Error in tourStatisticByDay:', error);
        }
    }

}

module.exports = reportByTourModel;
