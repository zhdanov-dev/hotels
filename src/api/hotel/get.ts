import express from 'express';
import Hotel from '../../models/Hotel.model';

const router = express.Router();

/**
 * Функция получения всех отелей
 */

router.get('/', async (request, response, next) => {
  try {
    const hotels = await Hotel.findAll();
    return response.status(200).json({
      hotels: hotels
    });
  } catch (error) {
    console.log(error);
  }
});

export default router;
