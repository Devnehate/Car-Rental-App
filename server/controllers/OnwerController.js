import imagekit from "../config/imagekit.js";
import User from "../models/User.js";
import Car from '../models/Car.js';
import fs from 'fs';
import Booking from "../models/Booking.js";
import jwt from 'jsonwebtoken';


export const changeRoleOwner = async (req, res) => {
    try {
        const { _id } = req.user;
        await User.findByIdAndUpdate(_id, { role: "owner" });
        
        // Get updated user to include in new token
        const updatedUser = await User.findById(_id);
        
        // Generate new token with updated role
        const token = jwt.sign({ 
            _id: updatedUser._id, 
            role: updatedUser.role,
            name: updatedUser.name,
            email: updatedUser.email
        }, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        res.json({ 
            success: true, 
            message: "Now you can list cars",
            token: token 
        });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: "Failed to update user role" });
    }
};

export const addCar = async (req, res) => {
    try {
        const { _id } = req.user;
        let car = JSON.parse(req.body.carData);
        const imageFile = req.file;

        const fileBuffer = fs.readFileSync(imageFile.path);
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: '/cars'
        })


        var optimizedImageURL = imagekit.url({
            path: response.filePath,
            transformation: [
                { width: '1280' },
                { quality: 'auto' },
                { format: 'webp' }
            ]
        });

        const image = optimizedImageURL;

        await Car.create({ ...car, owner: _id, image });

        res.json({ success: true, message: "Car added successfully" });


    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: "Failed to add car" });
    }
};

export const getOwnerCar = async (req, res) => {
    try {
        const { _id } = req.user;
        const cars = await Car.find({ owner: _id });
        res.json({ success: true, cars });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: "Failed to fetch owner's cars" });
    }
};

export const toggleCarAvailability = async (req, res) => {
    try {
        const { _id } = req.user;
        const { carId } = req.body;
        const car = await Car.findById(carId);

        if (car.owner.toString() !== _id.toString()) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        car.isAvailable = !car.isAvailable;

        await car.save();

        res.json({ success: true, message: "Car availability toggled successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: "Failed to toggle car availability" });
    }
};

export const deleteCar = async (req, res) => {
    try {
        const { _id } = req.user;
        const { carId } = req.body;
        const car = await Car.findById(carId);

        if (car.owner.toString() !== _id.toString()) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        car.owner = null;
        car.isAvailable = false;
        await car.save();

        res.json({ success: true, message: "Car deleted successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: "Failed to delete car" });
    }
};

export const getDashboardData = async (req, res) => {
    try {
        const { _id } = req.user;
        
        const currentUser = await User.findById(_id);
        
        if (!currentUser || currentUser.role !== "owner") {
            return res.json({ success: false, message: "Unauthorized" });
        }

        const cars = await Car.find({ owner: _id });
        const bookings = await Booking.find({ owner: _id }).populate("car").sort({ createdAt: -1 });

        const pendingBookings = await Booking.find({ owner: _id, status: "pending" });
        const completedBookings = await Booking.find({ owner: _id, status: "confirmed" });

        const monthlyRevenue = bookings.slice().filter(booking => booking.status === "confirmed").reduce((acc, booking) => acc + booking.price, 0);

        const dashBoardData = {
            totalCars: cars.length,
            totalBookings: bookings.length,
            pendingBookings: pendingBookings.length,
            completedBookings: completedBookings.length,
            recentBookings: bookings.slice(0, 3),
            monthlyRevenue
        }

        res.json({ success: true, dashBoardData });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: "Failed to fetch dashboard data" });
    }
}

export const updateUserImage = async (req, res) => {
    try {
        const { _id } = req.user;
        const imageFile = req.file;

        const fileBuffer = fs.readFileSync(imageFile.path);
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: '/users'
        })


        var optimizedImageURL = imagekit.url({
            path: response.filePath,
            transformation: [
                { width: '400' },
                { quality: 'auto' },
                { format: 'webp' }
            ]
        });

        const image = optimizedImageURL;

        await User.findByIdAndUpdate(_id, { image });
        res.json({ success: true, message: "image updated successfully" });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: "Failed to update user image" });
    }
}