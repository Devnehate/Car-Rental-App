import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log("Auth header received:", authHeader); // Debug

        if (!authHeader) {
            return res.status(401).json({success: false, message: "Not authorized, no token" });
        }

        const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
        
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded payload:", payload); // Debug
            
            if (!payload || !payload._id) {
                return res.status(401).json({success: false, message: "Not authorized, invalid payload"});
            }
            
            const freshUser = await User.findById(payload._id).select('-password');
            console.log("User from DB:", freshUser ? freshUser.role : "not found"); // Debug
            
            if (!freshUser) {
                return res.status(404).json({success: false, message: "User not found"});
            }
            
            req.user = freshUser;
            next();
        } catch (jwtError) {
            console.log("JWT verification error:", jwtError.message);
            return res.status(401).json({success: false, message: "Invalid token: " + jwtError.message});
        }
    } catch (error) {
        console.log("Auth error:", error.message); // Debug
        return res.status(500).json({success: false, message: "Server error: " + error.message});
    }
}