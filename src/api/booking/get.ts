import express from 'express';
import { pool as db } from '../../data/db';
import error from '../error/error';

const router = express.Router();

/**
 * Функция получения всех броней
 */

router.get('/all', async (request, response, next) => {
	try {
		const bookings = await db.query(`select *
                                     from booking`);
		return response.status(200).json({
			bookings: bookings.rows,
		});
	} catch (err) {
		return next(error.internal('Непредвиденная ошибка.'));
	}
});

/**
 * Функция получения свободных номеров в указанный период
 * @param {string} hotelId - Айди отеля
 * @param {string} dateFrom - Начало брони
 * @param {string} dateTo - Конец брони
 */

router.get('/period', async (request, response, next) => {
	try {
		const { hotelId, dateFrom, dateTo } = request.query;
		const rooms = await db.query(
			`select *
       from room
       except
       select room.id, number, hotel_id
       from room,
            booking
       where (room.hotel_id = $1 and booking.room_id = room.id and
              (($2 >= datefrom and $2 <= dateto) or ($3 >= datefrom and $3 <= dateto) or
               (datefrom >= $2 and datefrom <= $3) or
               (dateto >= $2 and dateto <= $3)))
       group by room.id
			`,
			[hotelId, dateFrom, dateTo]
		);

		return response.status(200).json({
			rooms: rooms.rows,
		});
	} catch (err) {
		return next(error.internal('Непредвиденная ошибка.'));
	}
});

export default router;
