import error from '../error/error';
import express from 'express';
import Booking from '../../models/Booking.model';

const router = express.Router();

/**
 * Функция отмены брони
 * @param {string} id - Айди брони
 */

router.delete('/', async (request, response, next) => {
  try {
    const { id } = request.body;
    if (!id) {
      return next(error.badRequest('Неверный параметр id!'));
    }
    await Booking.destroy({ where: { id: id } });
    return response.status(200).json({
      message: 'Бронь удалена!'
    });
  } catch (error) {
    console.log(error);
  }
});

export default router;
