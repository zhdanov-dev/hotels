import express from 'express';
import addRoomRoute from './add';
import getRoomRoute from './get';
import deleteRoomRoute from './delete';

const router = express.Router();

router.use('/add', addRoomRoute);
router.use('/get', getRoomRoute);
router.use('/delete', deleteRoomRoute);

export default router;
