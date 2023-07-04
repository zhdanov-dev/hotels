import error from '../error/error';
import express from 'express';
import Booking from '../../models/Booking.model';
import User from '../../models/User.model';
import getDatePeriod from '../../utils/getDatePeriod';

const router = express.Router();

/**
 * Функция бронирование номера в отеле
 * @param {string} userId - Номер клиента
 * @param {string} hotelId - Номер отеля
 * @param {string} roomId - Номер номера
 * @param {string} date - Дата бронирования
 */

router.post('/', async (request, response, next) => {
  try {
    const { userId, roomId, dateFrom, dateTo } = request.body;
    if (!userId || !roomId || !dateFrom || !dateTo) {
      return next(
        error.badRequest('Неверный параметр userId, roomId, hotelId или date!')
      );
    }
    const confirm = async () => {
      let vip = false;
      const user = await User.findOne({ where: { id: userId } });
      if (user.vip) vip = true;
      const booking = await Booking.create({
        userId: userId,
        roomId: roomId,
        dateFrom: dateFrom,
        dateTo: dateTo,
        vip: vip
      });

      return response.status(200).json({
        id: booking.id,
        roomId: booking.roomId,
        dateFrom: booking.dateFrom,
        dateTo: booking.dateTo,
        vip: booking.vip
      });
    };
    const candidates = await Booking.findAll({ where: { roomId: roomId } });
    if (candidates.length > 0) {
      let res = false;
      candidates.forEach(async candidate => {
        res = getDatePeriod(
          String(dateFrom),
          String(dateTo),
          candidate.dateFrom,
          candidate.dateTo
        );
      });
      if (res) {
        return next(error.badRequest('На данную дату номер уже забронирован!'));
      } else {
        confirm();
      }
    } else {
      confirm();
    }
  } catch (error) {
    console.log(error);
  }
});

export default router;
