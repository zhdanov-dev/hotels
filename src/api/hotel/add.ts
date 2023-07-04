import error from '../error/error';
import express from 'express';
import Hotel from '../../models/Hotel.model';

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
    const hotel = await Hotel.create({ name: name });
    return response.status(200).json({
      id: hotel.id,
      name: hotel.name
    });
  } catch (error) {
    console.log(error);
  }
});

export default router;
