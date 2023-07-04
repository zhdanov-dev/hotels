import express from 'express';
import authRoutes from './auth/routes';
import hotelRoutes from './hotel/routes';
import roomRoutes from './room/routes';
import bookingRoutes from './booking/routes';
 
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/hotel', hotelRoutes);
router.use('/room', roomRoutes);
router.use('/booking', bookingRoutes);

export default router;
