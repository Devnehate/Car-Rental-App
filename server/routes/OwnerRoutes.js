import express from 'express';
import { protect } from '../middleware/auth.js';
import { addCar, changeRoleOwner, deleteCar, getOwnerCar, toggleCarAvailability } from '../controllers/OnwerController.js';
import upload from '../middleware/multer.js';

const ownerRouter = express.Router();

ownerRouter.post('/change-role', protect, changeRoleOwner);
ownerRouter.post('/add-car', upload.single('image'), protect, addCar);
ownerRouter.get('/cars', protect, getOwnerCar);
ownerRouter.post('/toggle-car', protect, toggleCarAvailability);
ownerRouter.post('/delete-car', protect, deleteCar);




export default ownerRouter;