import error from '../error/error';
import express from 'express';
import Hotel from '../../models/Hotel.model';

const router = express.Router();

/**
 * Функция удаления отеля
 */

router.delete('/', async (request, response, next) => {
  try {
    const { id } = request.body;
    if (!id) {
      return next(error.badRequest('Неверный параметр id!'));
    }
    await Hotel.destroy({ where: { id: id } });
    return response.status(200).json({
      message: 'Отель удален!'
    });
  } catch (error) {
    console.log(error);
  }
});

export default router;
