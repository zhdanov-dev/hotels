import express from 'express';
import { pool as db } from '../../data/db';
import error from '../error/error';

const router = express.Router();

/**
 * Функция получения всех отелей
 */

router.get('/', async (request, response, next) => {
	try {
		const hotels = await db.query(`select *
                                   from hotel`);
		return response.status(200).json({
			hotels: hotels.rows,
		});
	} catch (err) {
		return next(error.internal('Непредвиденная ошибка.'));
	}
});

export default router;
