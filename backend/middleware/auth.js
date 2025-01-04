import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    try {
        // Log the headers to ensure the token is being sent
        console.log("Request Headers:", req.headers);

        // Extract token from the headers
        const rawToken = req.headers.token; // Or `req.headers.authorization`
        console.log("Raw Token:", rawToken);

        // Handle Bearer prefix if present
        const token = rawToken && rawToken.startsWith("Bearer ") ? rawToken.split(" ")[1] : rawToken;
        console.log("Processed Token:", token);

        if (!token) {
            console.log("No token provided");
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        // Verify the token
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", tokenDecode);

        // Attach user ID to the request body
        req.body.userId = tokenDecode.id;
        console.log("User ID attached to request body:", req.body.userId);

        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        res.status(401).json({ success: false, message: "Token verification failed" });
    }
};

export default authMiddleware;
