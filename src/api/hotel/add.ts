import error from '../error/error';
import express from 'express';
import { pool as db } from '../../data/db';

const router = express.Router();

/**
 * Функция добавления отеля
 * @param {string} name - Название отеля
 */

router.post('/', async (request, response, next) => {
	try {
		const { name } = request.body;
		if (!name) {
			return next(error.badRequest('Неверный параметр name!'));
		}
		const hotel = await db.query(
			`insert into hotel (name)
       values ($1) returning *`,
			[name]
		);
		return response.status(200).json({
			id: hotel.rows[0].id,
			name: hotel.rows[0].name,
		});
	} catch (err) {
		return next(error.internal('Непредвиденная ошибка.'));
	}
});

export default router;
