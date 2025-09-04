import User from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Car from '../models/Car.js';

const generateToken = async (userId) => {
    const user = await User.findById(userId);
    return jwt.sign({ 
        _id: userId,
        role: user ? user.role : 'user'
    }, process.env.JWT_SECRET, { expiresIn: '7d' });
}


export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password || password.length < 8) {
            return res.json({ success: false, message: 'Fill all the fields' })
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.json({ success: false, message: 'User already exists' })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ name, email, password: hashedPassword });

        const token = await generateToken(user._id.toString());

        res.json({ success: true, token });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid credentials' });
        }

        const token = await generateToken(user._id.toString());

        res.json({ success: true, token });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

export const getUserData = async (req, res) => {
    try {
        const userFromDb = await User.findById(req.user._id); // fetch fresh user from DB
        res.json({ success: true, user: userFromDb });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

export const getCars = async (req, res) => {
    try {
        const cars = await Car.find({isAvailable: true});
        res.json({ success: true, cars });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}