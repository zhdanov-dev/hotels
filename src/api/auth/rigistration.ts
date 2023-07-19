import error from '../error/error';
import express from 'express';
import { pool as db } from '../../data/db';
import bcrypt from 'bcrypt';
import { generateToken, saveToken } from './token';

const router = express.Router();

/**
 * Функция авторизации
 * @param {string} name - Имя пользователя
 * @param {string} email - Email пользователя
 * @param {string} password - Пароль
 * @param {string} vip - Статус пользователя
 * Проверяем не зарегистрирован ли пользователь, если нет то хешируем пароль и создаем запись в бд,
 * также создаем пару токенов и возвращаем AccessToken на клиент
 */

router.post('/', async (request, response, next) => {
	try {
		const { name, email, password, vip } = request.body;
		if (!name || !email || !password || !vip) {
			return next(error.badRequest('Введите все необходимые данные!'));
		}
		const candidate = await db.query(
			`select *
       from "user"
       where email = $1`,
			[email]
		);
		if (!candidate.rows[0]) {
			const hashpass = await bcrypt.hash(password, 5);
			const user = await db.query(
				`insert into "user" (name, email, password, vip)
         values ($1, $2, $3, $4) returning *`,
				[name, email, hashpass, vip]
			);

			const tokens = generateToken(user.rows[0].id, email);
			await saveToken(user.rows[0].id, tokens.refreshToken);
			response.cookie('refreshToken', tokens.refreshToken, {
				maxAge: 15 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			});
			return response.status(200).json({
				id: user.rows[0].id,
				email: user.rows[0].email,
				token: tokens.accessToken,
			});
		} else {
			return next(error.badRequest('Пользователь уже существует!'));
		}
	} catch (err) {
		return next(error.internal('Непредвиденная ошибка.'));
	}
});

export default router;
