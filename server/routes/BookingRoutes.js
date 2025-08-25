import express from 'express';
import { changeBookingStatus, checkAvailabilityOfCar, createBookings, getOwnerBookings, getUserBookings } from '../controllers/BookingController.js';
import { protect } from '../middleware/auth.js';

const bookingRouter = express.Router();


bookingRouter.post('/check-availability', checkAvailabilityOfCar);
bookingRouter.post('/create', protect, createBookings);
bookingRouter.get('/user', protect, getUserBookings);
bookingRouter.get('/owner', protect, getOwnerBookings);
bookingRouter.put('/change-status', protect, changeBookingStatus);

export default bookingRouter;