import error from '../error/error';
import express from 'express';
import { pool as db } from '../../data/db';

const router = express.Router();

/**
 * Функция бронирование номера в отеле
 * @param {string} userId - Номер клиента
 * @param {string} hotelId - Номер отеля
 * @param {string} roomId - Номер номера
 * @param {string} date - Дата бронирования
 */

router.post('/', async (request, response, next) => {
	try {
		const { userId, roomId, dateFrom, dateTo } = request.body;
		if (!userId || !roomId || !dateFrom || !dateTo) {
			return next(
				error.badRequest('Неверный параметр userId, roomId, hotelId или date!')
			);
		}

		const candidates = await db.query(
			`select *
       from booking
       where (room_id = $1 and
              (($2 >= datefrom and $2 <= dateto) or ($3 >= datefrom and $3 <= dateto) or
               (datefrom >= $2 and datefrom <= $3) or
               (dateto >= $2 and dateto <= $3)))`,
			[roomId, dateFrom, dateTo]
		);

		if (candidates.rows.length === 0) {
			let vip = false;
			const user = await db.query(
				`select *
         from "user"
         where id = $1`,
				[userId]
			);
			if (user.rows[0].vip) vip = true;
			const booking = await db.query(
				`insert into booking (user_id, room_id, datefrom, dateto, vip)
         values ($1, $2, $3, $4, $5)
         returning *`,
				[userId, roomId, dateFrom, dateTo, vip]
			);

			return response.status(200).json(booking.rows[0]);
		} else {
			return next(error.badRequest('На данную дату номер уже забронирован!'));
		}
	} catch (err) {
		return next(error.internal('Непредвиденная ошибка.'));
	}
});

export default router;
