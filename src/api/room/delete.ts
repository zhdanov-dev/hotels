import error from '../error/error';
import express from 'express';
import { pool as db } from '../../data/db';

const router = express.Router();

/**
 * Функция удаления номера
 * @param {string} id - Айди номера
 */

router.delete('/', async (request, response, next) => {
	try {
		const { id } = request.body;
		if (!id) {
			return next(error.badRequest('Неверный параметр id!'));
		}
		await db.query(
			`delete
       from room
       where id = $1`,
			[id]
		);
		return response.status(200).json({
			message: 'Номер удален!',
		});
	} catch (err) {
		return next(error.internal('Непредвиденная ошибка.'));
	}
});

export default router;
