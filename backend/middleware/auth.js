import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Expecting 'Bearer <token>'
    
    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized! Login again" });
    }

    try {
        const token_Decode = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = token_Decode.id;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            console.error('Token expired:', error.expiredAt);
            return res.status(401).json({ success: false, message: "Token expired" });
        }
        console.error(error);
        res.status(401).json({ success: false, message: "Error" });
    }
};

export default authMiddleware;
