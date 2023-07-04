import error from '../error/error';
import express from 'express';
import Room from '../../models/Room.model';

const router = express.Router();

/**
 * Функция удаления номера
 * @param {string} id - Айди номера
 */

router.delete('/', async (request, response, next) => {
  try {
    const { id } = request.body;
    if (!id) {
      return next(error.badRequest('Неверный параметр id!'));
    }
    await Room.destroy({ where: { id: id } });
    return response.status(200).json({
      message: 'Номер удален!'
    });
  } catch (error) {
    console.log(error);
  }
});

export default router;
