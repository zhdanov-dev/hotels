import error from '../error/error';
import express from 'express';
import { pool as db } from '../../data/db';

const router = express.Router();

/**
 * Функция удаления отеля
 * @param {string} id - Айди отеля
 */

router.delete('/', async (request, response, next) => {
	try {
		const { id } = request.body;
		if (!id) {
			return next(error.badRequest('Неверный параметр id!'));
		}
		await db.query(
			`delete
       from hotel
       where id = $1`,
			[id]
		);
		return response.status(200).json({
			message: 'Отель удален!',
		});
	} catch (error) {
		return next(error.internal('Непредвиденная ошибка.'));
	}
});

export default router;
