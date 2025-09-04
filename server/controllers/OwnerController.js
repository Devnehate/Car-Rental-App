import imagekit from "../config/imagekit.js";
import User from "../models/User.js";
import Car from '../models/Car.js';
import fs from 'fs';
import Booking from "../models/Booking.js";
import jwt from 'jsonwebtoken';


export const changeRoleOwner = async (req, res) => {
    try {
        console.log("Change role request for user:", req.user._id);
        
        // Use findByIdAndUpdate to ensure atomic update
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { role: 'owner' },
            { new: true, runValidators: true } // returns updated document
        );
        
        if (!updatedUser) {
            console.log("User not found during role update");
            return res.status(404).json({ success: false, message: "User not found" });
        }

        console.log("User role updated to:", updatedUser.role);

        // Generate new token with updated role
        const token = jwt.sign({
            _id: updatedUser._id.toString(),
            role: updatedUser.role // Explicitly include updated role
        }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ 
            success: true, 
            message: "Role updated successfully", 
            token,
            user: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role
            }
        });
    } catch (error) {
        console.error("Error updating role:", error);
        res.status(500).json({ success: false, message: error.message || "Failed to update role" });
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

        const dashboardData = {
            totalCars: cars.length,
            totalBookings: bookings.length,
            pendingBookings: pendingBookings.length,
            completedBookings: completedBookings.length,
            recentBookings: bookings.slice(0, 3),
            monthlyRevenue
        }

        res.json({ success: true, dashboardData });

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