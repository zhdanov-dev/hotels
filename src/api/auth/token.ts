import jwt, { JwtPayload } from 'jsonwebtoken';
import { pool as db } from '../../data/db';

/**
 * Генерация пары токенов
 * @param {string} id - Id пользователя
 * @param {string} email - Email пользователя
 * Пара токенов access, refresh
 */

export function generateToken(id: number, email: string) {
	try {
		const accessToken = jwt.sign({ id: id, email }, process.env.SECRET_KEY, {
			expiresIn: '24h',
		});
		const refreshToken = jwt.sign({ id: id, email }, process.env.REFRESH_KEY, {
			expiresIn: '15d',
		});
		return { accessToken, refreshToken };
	} catch (error) {
		console.log(error);
	}
}

/**
 * Сохранение refresh токена в базу данных
 * @param {string} userId - Id пользователя
 * @param {string} refreshToken - refresh токен
 * Перезаписываем токен в бд, если такой таблицы нет, то создаем ее
 */

export async function saveToken(userId: number, refreshToken: string) {
	try {
		const tokenData = await db.query(
			`select *
       from token
       where user_id = $1`,
			[userId]
		);
		if (tokenData.rows[0]) {
			await db.query(
				`update token
         set refreshtoken = $1
         where id = $2`,
				[refreshToken, userId]
			);
		}
		const token = await db.query(
			`insert into token (user_id, refreshtoken)
       values ($1, $2) returning *`,
			[userId, refreshToken]
		);
		return token.rows[0];
	} catch (error) {
		console.log(error);
	}
}

/**
 * Удаление refresh токена из базы данных
 * @param {string} refreshToken - refresh токен
 * Удаляем таблицу с refresh токеном из бд
 */

export async function removeToken(refreshToken: string) {
	try {
		const tokenData = await db.query(
			`delete
       from token
       where refreshtoken = $1`,
			[refreshToken]
		);
		return tokenData.rows[0];
	} catch (error) {
		console.log(error);
	}
}

/**
 * Ищем токен в базе данных
 * @param {string} refreshToken - refresh токен
 */

export async function findToken(refreshToken: string) {
	try {
		const tokenData = await db.query(
			`select *
       from token
       where refreshtoken = $1`,
			[refreshToken]
		);
		return tokenData.rows[0];
	} catch (error) {
		console.log(error);
	}
}

/**
 * Валидируем токены
 * @param {string} token - access/refresh токен
 */

export function validateAccess(token: string): jwt.JwtPayload {
	try {
		return <JwtPayload>jwt.verify(token, process.env.SECRET_KEY);
	} catch (error) {
		return error;
	}
}

export function validateRefresh(token: string) {
	try {
		return jwt.verify(token, process.env.REFRESH_KEY);
	} catch (error) {
		return error;
	}
}
