import express from 'express';
import addHotelRoute from './add';
import getHotelRoute from './get';
import deleteHotelRoute from './delete';

const router = express.Router();

router.use('/add', addHotelRoute);
router.use('/get', getHotelRoute);
router.use('/delete', deleteHotelRoute);

export default router;
