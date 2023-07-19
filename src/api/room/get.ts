import express from 'express';
import error from '../error/error';
import { pool as db } from '../../data/db';

const router = express.Router();

/**
 * Функция получения всех номеров
 * @param {string} hotelId - Айди отеля
 */

router.get('/', async (request, response, next) => {
	try {
		const { hotelId } = request.body;
		if (!hotelId) {
			return next(error.badRequest('Неверный параметр hotelId!'));
		}
		const rooms = await db.query(
			`select *
       from room
       where hotel_id = $1`,
			[hotelId]
		);
		return response.status(200).json({
			rooms: rooms.rows,
		});
	} catch (err) {
		return next(error.internal('Непредвиденная ошибка.'));
	}
});

export default router;
