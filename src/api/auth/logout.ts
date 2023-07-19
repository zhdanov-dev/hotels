import express from 'express';
import { removeToken } from './token';
import error from '../error/error';

const router = express.Router();

/**
 * Функция выхода
 * Удаляем refresh токен из бд и очищаяем куки
 */

router.post('/', async (request, response, next) => {
	try {
		const { refreshToken } = request.cookies;
		await removeToken(refreshToken);
		response.clearCookie('refreshToken');
		return response.json('logout');
	} catch (err) {
		return next(error.internal('Непредвиденная ошибка.'));
	}
});

export default router;
