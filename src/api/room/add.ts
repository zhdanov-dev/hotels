import error from '../error/error';
import express from 'express';
import Room from '../../models/Room.model';

const router = express.Router();

/**
 * Функция добавления номера в отель
 * @param {string} number - Номер номера
 * @param {string} hotelId - Айди отеля
 */

router.post('/', async (request, response, next) => {
  try {
    const { number, hotelId } = request.body;
    if (!number || !hotelId) {
      return next(error.badRequest('Неверный параметр number или hotelId!'));
    }
    const room = await Room.create({ number: number, hotelId: hotelId });
    return response.status(200).json({
      id: room.id,
      number: room.number,
      hotelId: room.hotelId
    });
  } catch (error) {
    console.log(error);
  }
});

export default router;
