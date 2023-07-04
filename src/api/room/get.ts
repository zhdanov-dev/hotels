import express from 'express';
import Room from '../../models/Room.model';
import error from '../error/error';

const router = express.Router();

/**
 * Функция получения всех номеров
 * @param {string} hotelId - Айди отеля
 */

router.get('/', async (request, response, next) => {
  try {
    const { hotelId } = request.body;
    if (!hotelId) {
      return next(error.badRequest('Неверный параметр hotelId!'));
    }
    const rooms = await Room.findAll({where: {hotelId: hotelId}});
    return response.status(200).json({
      rooms: rooms
    });
  } catch (error) {
    console.log(error);
  }
});

export default router;
