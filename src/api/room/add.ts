import error from '../error/error';
import express from 'express';
import { pool as db } from '../../data/db';

const router = express.Router();

/**
 * Функция добавления номера в отель
 * @param {string} number - Номер номера
 * @param {string} hotelId - Айди отеля
 */

router.post('/', async (request, response, next) => {
	try {
		const { number, hotelId } = request.body;
		if (!number || !hotelId) {
			return next(error.badRequest('Неверный параметр number или hotelId!'));
		}
		const room = await db.query(
			`insert into room (number, hotel_id)
       values ($1, $2)
       returning *`,
			[number, hotelId]
		);
		return response.status(200).json({
			id: room.rows[0].id,
			number: room.rows[0].number,
			hotelId: room.rows[0].hotelId,
		});
	} catch (err) {
		return next(error.internal('Непредвиденная ошибка.'));
	}
});

export default router;
