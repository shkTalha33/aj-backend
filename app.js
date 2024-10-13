import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/router.js";
import mongoose from "mongoose";
import { checkUser } from "./middleware/auth.js";

// Define the allowed origins and CORS options
const corsOptions = {
  origin: ["https://skblogs-33.vercel.app", "https://www.theskblogs.com", "https://theskblogs.com"],
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow these HTTP methods
  credentials: true, // Allow credentials like cookies or authorization headers
  optionsSuccessStatus: 200, // Handle successful OPTIONS preflight requests
};

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

// Apply CORS middleware to all routes
app.use(cors(corsOptions));

// Define your routes and middleware
app.use(express.json());
app.use(router);
app.use(express.static("./uploads"));

// Handle the preflight OPTIONS request
app.options('*', cors(corsOptions));

app.get("/", checkUser, (req, res) => {
  const username = res.locals.username;
  res.status(200).json({
    message: "Welcome to SK-Blogs!",
    isLogedin: !!username,
    ...(username && { username }),
  });
});

// Connect to MongoDB and start the server
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.URI);
    console.log("Connected to database successfully.");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

connectDB();
