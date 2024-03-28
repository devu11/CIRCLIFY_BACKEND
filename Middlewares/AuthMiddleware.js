import Jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";

configDotenv();
const secret = process.env.JWT_KEY;

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (token) {
            
            const decoded = Jwt.verify(token, secret);
           
            req.body._id = decoded?.id;
            next();
        } else {
            throw new Error("No token provided");
        }
    } catch (error) {
        console.log("Auth Middleware Error:", error);
        res.status(401).json({ message: "Unauthorized" });
    }
};

export default authMiddleware;
