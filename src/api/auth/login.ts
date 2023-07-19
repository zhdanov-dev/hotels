import bcrypt from 'bcrypt';
import error from '../error/error';

import express from 'express';
import { findToken, generateToken, saveToken, validateRefresh } from './token';
import { pool as db } from '../../data/db';

const router = express.Router();

/**
 * Функция авторизации
 * @param {string} password - Пароль
 * @param {string} email - Email пользователя
 */

router.post('/', async (request, response, next) => {
	try {
		const { password, email } = request.body;
		if (!email || !password) {
			return next(error.badRequest('Некорректный email или password!'));
		}
		const candidate = await db.query(
			`select *
       from "user"
       where email = $1`,
			[email]
		);
		if (candidate.rows[0]) {
			let comppass = bcrypt.compareSync(password, candidate.rows[0].password);
			if (!comppass) {
				return next(error.internal('Указан неверный пароль!'));
			} else {
				const tokens = generateToken(candidate.rows[0].id, email);
				await saveToken(candidate.rows[0].id, tokens.refreshToken);
				response.cookie('refreshToken', tokens.refreshToken, {
					maxAge: 15 * 24 * 60 * 60 * 1000,
					httpOnly: true,
				});
				return response.status(200).json({
					id: candidate.rows[0].id,
					email: candidate.rows[0].email,
					token: tokens.accessToken,
				});
			}
		} else {
			return next(error.internal('Пользователь не найден!'));
		}
	} catch (err) {
		return next(error.internal('Непредвиденная ошибка.'));
	}
});

router.get('/refresh', async (request, response, next) => {
	try {
		const { refreshToken } = request.cookies;
		if (!refreshToken)
			return next(error.unauthorized('Пользователь не авторизован!'));
		const userData = validateRefresh(refreshToken); // валидируем токен
		const token = await findToken(refreshToken);
		if (!userData || !token)
			return next(error.internal('Отсутсвует токен или userdata!'));
		const user = await db.query(
			`select *
       from "user"
       where id = $1`,
			[userData.id]
		);
		const tokens = generateToken(user.rows[0].id, user.rows[0].email);
		await saveToken(user.rows[0].id, tokens.refreshToken);
		response.cookie('refreshToken', tokens.refreshToken, {
			maxAge: 15 * 24 * 60 * 60 * 1000,
			httpOnly: true,
		});
		return response.json(tokens.accessToken);
	} catch (err) {
		return next(error.internal('Непредвиденная ошибка.'));
	}
});

export default router;
