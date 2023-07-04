import User from '../../models/User.model';
import { genereteToken, saveToken } from './token';
import bcrypt from 'bcrypt';
import error from '../error/error';
import express from 'express';

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
    const candidate = await User.findOne({ where: { email: email } });
    if (!candidate) {
      const hashpass = await bcrypt.hash(password, 5);
      const user = await User.create({
        name: name,
        email: email,
        password: hashpass,
        vip: vip
      });
      const tokens = genereteToken(user.id, email);
      await saveToken(user.id, tokens.refreshToken);
      response.cookie('refreshToken', tokens.refreshToken, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true
      });
      return response.status(200).json({
        id: user.id,
        email: user.email,
        token: tokens.accessToken
      });
    } else {
      return next(error.badRequest('Пользователь уже существует!'));
    }
  } catch (error) {
    console.log(error);
  }
});

export default router;
