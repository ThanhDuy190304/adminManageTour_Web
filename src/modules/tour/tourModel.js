const db = require('../../config/db'); // Giả sử bạn có một tệp db.js để kết nối với cơ sở dữ liệu

class tourModel {
    static async getNumberOfTour() {
        const query = `SELECT COUNT(*) AS total_tour
                        FROM tours`;
        try {
            const result = await db.query(query);
            return result.rows[0];
        } catch (err) {
            console.log("Error in tourModel", err);
        }
        return null;
    }
    static async addTourId(tourID,title,brief,detail,location,price,rate,voucher) {
        const query = `Insert into tours(tour_id, title, brief, details, location_id, prices, rate, voucher)
                        values ($1,$2,$3,$4,(select location_id
                                        from locations
                                        where location_name = $5),$6,$7,$8);
                        `;
        const nextDetailTour = await tourModel.getNextIDDetail();
        const query3 = `Insert into detail_tours(detail_tour_id, tour_id, status, tour_date, booked_quantity, max_quantity)
                        values ($1, $2, 'available', '2025-01-28', 0, 50)`;
        try {
            await db.query(query, [tourID,title,brief,detail,location,price,rate,voucher]);
            await db.query(query3, [nextDetailTour, tourID]);
        } catch (err) {
            console.log("Error in tourModel", err);
        }
        return null;
    }

    static async updateDetailedTour(tourId, detail_tour_id, date, status, maxQuantity) {
        
        console.log("updateDetailedTour",tourId, detail_tour_id, date, status, maxQuantity)
        const query = `Update detail_tours
                        Set tour_date = $3, status = $4, max_quantity = $5
                        Where detail_tour_id = $2 AND tour_id = $1
                        `;
        try {
            await db.query(query, [tourId, detail_tour_id, date, status, maxQuantity]);
        } catch (err) {
            console.log("Error in tourModel", err);
        }
        return null;
    }

    static async deleteImageTour(tourID) {
        console.log("deleteImageTour",tourID)
        const query = `delete from tour_images
                        where tour_id = $1;
                        `;
        try {
            await db.query(query, [tourID]);
        } catch (err) {
            console.log("Error in tourModel", err);
        }
        return null;
    }

    static async addImageTour(touID,uploadedUrl, index) {
        console.log("addImageTour",touID,uploadedUrl, index)
        const query = `Insert into tour_images(img_id, tour_id, img_url)
                        values ($3,$1,$2);
                        `;
        try {
            await db.query(query, [touID,uploadedUrl, index+1]);
        } catch (err) {
            console.log("Error in tourModel", err);
        }
        return null;
    }

    static async addDetailedTour(touID,date,status,maxQuantity, index) {
        const query = `Insert into detail_tours(detail_tour_id, tour_id, status, tour_date, booked_quantity, max_quantity)
                        values ((SELECT 
                            CASE 
                                WHEN MAX(CAST(SUBSTRING(detail_tour_id, 2) AS INTEGER)) IS NULL THEN 'd001'
                                ELSE CONCAT('d', LPAD(CAST(MAX(CAST(SUBSTRING(detail_tour_id, 2) AS INTEGER)) + 1 AS CHAR), 3, '0'))
                            END AS next_detail_tour_id
                        FROM detail_tours
                        WHERE tour_id = '$1'),$1,$3,$2,0,$4);
                        `;
        try {
            await db.query(query, [touID,date,status,maxQuantity, index]);
        } catch (err) {
            console.log("Error in tourModel", err);
        }
        return null;
    }

    static async UpdateTour(tourId, title,brief,detail,location,price,rate,voucher) {
        console.log(tourId, title,brief,detail,location,price,rate,voucher)
        const query = `UPDATE tours
                        SET title=$2,brief=$3,details=$4,location_id=(select location_id
                                                                    from locations
                                                                    where location_name = $5),prices=$6,rate=$7,voucher=$8
                        WHERE tour_id = $1
                        `;
                    
        try {
            await db.query(query, [tourId,title,brief,detail,location,price,rate,voucher]);
        } catch (err) {
            console.log("Error in tourModel", err);
        }
        return null;
    }
    static async getNextID() {
        const query = `SELECT CONCAT('t', LPAD((CAST(SUBSTRING(MAX(tour_id) FROM 2) AS INTEGER) + 1)::TEXT, 3, '0')) AS next_tour_id
                        FROM tours;`;
        try {
            const result = await db.query(query);
            return result.rows[0].next_tour_id;
        } catch (err) {
            console.log("Error in tourModel", err);
        }
        return null;
    }
    static async getNextIDDetail() {
        const query = `SELECT CONCAT('d', LPAD((CAST(SUBSTRING(MAX(detail_tour_id) FROM 2) AS INTEGER) + 1)::TEXT, 3, '0')) AS next_detail_tour_id
                        FROM detail_tours;`;
        try {
            const result = await db.query(query);
            return result.rows[0].next_detail_tour_id;
        } catch (err) {
            console.log("Error in tourModel", err);
        }
        return null;
    }
	static async getTours(page, searchQuery, sort, locationQuery, companyQuery) {
		if (!Array.isArray(locationQuery)) { locationQuery = [locationQuery]; }
        if (!Array.isArray(companyQuery)) { companyQuery = [companyQuery]; }
		const query = `
            FROM tours t
            LEFT JOIN tour_images t_i ON t.tour_id = t_i.tour_id
            LEFT JOIN locations lo ON lo.location_id = t.location_id
            WHERE t_i.img_id = 1
            AND (('${searchQuery}' = 'default' OR t.title LIKE CONCAT('%', '${searchQuery}', '%'))
            OR ('${searchQuery}' = 'default' OR t.brief LIKE CONCAT('%', '${searchQuery}', '%')))
            AND (
                '${locationQuery[0]}' LIKE 'default' OR
                ${locationQuery.map((location, index) => `
                (lo.location_name LIKE CONCAT('%', '${location}', '%'))
                ${index < locationQuery.length - 1 ? 'OR' : ''}
                `).join('')}
            )
        `;
		const countSelect = `SELECT COUNT(*) AS total_rows`;
		const dataSelect = `SELECT t.tour_id, t.title, t.brief, t.prices, t_i.img_url, t.location_id`;

        let filterSort
        if (sort) {
            switch (sort) {
                case 'asc_price':
                    filterSort = 'ORDER BY t.prices ASC';
                    break;
                case 'desc_price':
                    filterSort =  'ORDER BY t.prices DESC';
                    break;
                case 'asc_rate':
                    filterSort = 'ORDER BY t.rate ASC';
                    break;
                case 'desc_rate':
                    filterSort = 'ORDER BY t.rate DESC';
                    break;
                default:
                    filterSort = ''; // Giá trị mặc định nếu không khớp
                    break;
            }
        }

		const countQuery = `${countSelect} ${query}`;
		const dataQuery = `
            ${dataSelect}
            ${query}
            ${filterSort}
            LIMIT 6 OFFSET ${(page - 1) * 6}
        `;
        console.log(dataQuery)
		try {
			const paginatedTours = await db.query(dataQuery);
			const totalPages = await db.query(countQuery);
			return {
				paginatedTours: paginatedTours.rows,
				totalPages: Math.ceil(totalPages.rows[0].total_rows / 6)
			};
		} catch (err) {
			throw new Error('Error fetching tours by location: ' + err.message);
		}
	}

	// static async getToursByIDLocation(tour_id) {
	// 	const query = `
    //         SELECT t.tour_id, t.title, t.brief, t.prices, t_i.img_url, t.location_id
    //         FROM tours t 
    //         INNER JOIN tour_images t_i ON t.tour_id = t_i.tour_id
    //         INNER JOIN tours c ON c.tour_id = $1 AND c.location_id = t.location_id
    //         WHERE t_i.img_id = 1 AND t.tour_id != $1
    //     `;
	// 	const values = [tour_id];
	// 	try {
	// 		const result = await db.query(query, values);
	// 		return result.rows;
	// 	} catch (err) {
	// 		throw new Error('Error fetching tours by location: ' + err.message);
	// 	}
	// }

	// static async getBestdealTours() {
	// 	const query = `
    //         SELECT t.tour_id, t.title, t.brief, t.prices, t_i.img_url, t.rate, t.voucher, t.location_id
    //         FROM tours t 
    //         INNER JOIN locations l ON t.location_id = l.location_id
    //         INNER JOIN tour_images t_i ON t.tour_id = t_i.tour_id
    //         WHERE t.rate >= 4 AND t.voucher >= 8 AND t_i.img_id = 1
    //         ORDER BY rate DESC
    //         LIMIT 3
    //     `;
	// 	try {
	// 		const result = await db.query(query);
	// 		return result.rows;
	// 	} catch (err) {
	// 		throw new Error('Error fetching tours by location: ' + err.message);
	// 	}
	// }

	static async getBestrateTours() {
		const query = `
            SELECT t.tour_id, t.title, t.brief, t.prices, t_i.img_url, t.rate, t.voucher, t.location_id
            FROM tours t 
            INNER JOIN locations l ON t.location_id = l.location_id
            INNER JOIN tour_images t_i ON t.tour_id = t_i.tour_id
            WHERE t.rate >= 4 AND t.prices <= 150.0 AND t_i.img_id = 1
            ORDER BY rate DESC
            LIMIT 4
        `;
		try {
			const result = await db.query(query);
			return result.rows;
		} catch (err) {
			throw new Error('Error fetching tours by location: ' + err.message);
		}
	}

	static async getTourByID(tour_id) {
		const query = `
            SELECT t.tour_id, t.title, t.brief, t.details, t.prices, t.rate, t.voucher, l.location_name,l.location_id,
            img_urls.img_array, 
            ARRAY_AGG(
                JSON_BUILD_OBJECT(  
                    'schedule_id', dt.detail_tour_id,
                    'status', dt.status,
                    'max_quantity', dt.max_quantity,
                    'status', dt.status,
                    'available_quantity', 
                        CASE
                            WHEN (dt.max_quantity - dt.booked_quantity) > 0 THEN (dt.max_quantity - dt.booked_quantity)
                            ELSE 0
                        END,
                    'tour_date', dt.tour_date
                )
            ) AS schedules_tour
            FROM tours t
            LEFT JOIN (
                SELECT tour_id, ARRAY_AGG(img_url) AS img_array
                FROM tour_images
                GROUP BY tour_id
            ) img_urls ON t.tour_id = img_urls.tour_id
            LEFT JOIN detail_tours dt ON t.tour_id = dt.tour_id
            LEFT JOIN locations l ON l.location_id = t.location_id
            WHERE t.tour_id = $1
            GROUP BY t.tour_id, img_urls.img_array, l.location_name, l.location_id
            LIMIT 1;
        `;
		try {
			const result = await db.query(query, [tour_id]);
			if (result.rows[0]) {
				const tourData = result.rows[0];
				return {
					tourId: tourData.tour_id,
					title: tourData.title,
					brief: tourData.brief,
					details: tourData.details,
					locationId: tourData.location_id,
                    locationName: tourData.location_name,
					prices: tourData.prices,
					rate: tourData.rate,
					voucher: tourData.voucher,
					imgArray: tourData.img_array || [],
					schedulesTour: tourData.schedules_tour || []
				};
			} else {
				throw new Error('Tour not found');
			}
		} catch (error) {
			console.error(error.message);
			throw error;
		}
	}

	// static async getTourScheduleDetail(tourId, scheduleId) {
	// 	const query = `
    //         SELECT
    //             dt.status,
    //             dt.tour_date,
    //             GREATEST(dt.max_quantity - dt.booked_quantity, 0) AS available_quantity,
    //             t.title,
    //             t.prices,
    //             t.rate,
    //             ti.img_url AS first_image
    //         FROM detail_tours dt
    //         JOIN tours t ON t.tour_id = dt.tour_id
    //         LEFT JOIN tour_images ti ON ti.tour_id = t.tour_id
    //         WHERE dt.tour_id = $1 AND dt.detail_tour_id = $2
    //         ORDER BY ti.img_id LIMIT 1;
    //     `;
	// 	try {
	// 		const result = await db.query(query, [tourId, scheduleId]);
	// 		if (result.rows.length > 0) {
	// 			const tourDetails = result.rows[0];
	// 			return {
	// 				status: tourDetails.status,
	// 				tourDate: tourDetails.tour_date,
	// 				availableQuantity: tourDetails.available_quantity,
	// 				title: tourDetails.title,
	// 				prices: tourDetails.prices,
	// 				rate: tourDetails.rate,
	// 				firstImage: tourDetails.first_image
	// 			};
	// 		}
	// 		return null;
	// 	} catch (error) {
	// 		console.error("Error getTourScheduleDetail in tourModel:", error);
	// 		throw new Error("Error fetching tour details");
	// 	}
	// }
}

module.exports = tourModel;
