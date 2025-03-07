import express from "express";
import cors from "cors";
import { adminRouter } from "./Routes/AdminRoute.js";
import { EmployeeRouter } from "./Routes/EmployeeRoute.js"; 
import Jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import path from "path"; 

const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], // ✅ Allow both frontend ports
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// ✅ Manually set headers for all responses (Fixes CORS issue)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});


app.use(express.json());
app.use(cookieParser());
app.use(express.static("Public"));  

// ✅ Add this line to serve employee images correctly
app.use("/images", express.static(path.join(process.cwd(), "Public/Images"))); // ✅ Correcting the folder path
 

// ✅ Use different paths for admin and employee routes
app.use("/auth", adminRouter);      // 🔹 Admin routes
app.use("/employee", EmployeeRouter); // 🔹 Employee routes

// ✅ Authentication middleware
const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        Jwt.verify(token, "jwt_secret_key", (err, decoded) => {
            if (err) return res.json({ Status: false, Error: "Wrong Token" });
            req.id = decoded.id;
            req.role = decoded.role;
            next();
        });
    } else {
        return res.json({ Status: false, Error: "Not authenticated" });
    }
};

// ✅ Verify user authentication route
app.get("/verify", verifyUser, (req, res) => {
    return res.json({ Status: true, role: req.role, id: req.id });
});

// ✅ Start server
app.listen(3001, () => {
    console.log("✅ Server is running on port 3001");
});
