import express from 'express';
import addBookingRoute from './add';
import getBookingRoute from './get';
import deleteBookingRoute from './delete';

const router = express.Router();

router.use('/add', addBookingRoute);
router.use('/get', getBookingRoute);
router.use('/delete', deleteBookingRoute);

export default router;
