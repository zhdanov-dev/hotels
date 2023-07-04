import express from 'express';
import Booking from '../../models/Booking.model';
import Room from '../../models/Room.model';
import getDatePeriod from '../../utils/getDatePeriod';

const router = express.Router();

/**
 * Функция получения всех броней
 */

router.get('/all', async (request, response) => {
  try {
    const bookings = await Booking.findAll();
    return response.status(200).json({
      bookings: bookings
    });
  } catch (error) {
    console.log(error);
  }
});

/**
 * Функция получения свободных номеров в указанный период
 * @param {string} hotelId - Айди отеля
 * @param {string} dateFrom - Начало брони
 * @param {string} dateTo - Конец брони
 */

router.get('/period', async (request, response) => {
  try {
    const { hotelId, dateFrom, dateTo } = request.query;
    const result: Room[] = [];
    const rooms = await Room.findAll({ where: { hotelId: hotelId } });
    for (let i = 0; i < rooms.length; i++) {
      const bookings = await Booking.findAll({
        where: { roomId: rooms[i].id }
      });

      let res = false;
      bookings.forEach(async candidate => {
        res = getDatePeriod(
          String(dateFrom),
          String(dateTo),
          candidate.dateFrom,
          candidate.dateTo
        );
      });
      if (!res) {
        result.push(rooms[i]);
      }
    }
    return response.status(200).json({
      rooms: result
    });
  } catch (error) {
    console.log(error);
  }
});

export default router;
