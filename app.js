import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/router.js";
import { checkUser } from "./middleware/auth.js";
import mongoose from "mongoose";

// const corsOptions = {
//   origin: ["https://www.theskblogs.com", "https://theskblogs.com"],
//   methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
//   optionsSuccessStatus: 200, // Some legacy browsers choke on 204
//   credentials: true, // Allow credentials (cookies, authorization headers, etc.)
// };

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;
app.use(cors());
app.use(cors(corsOptions));
// app.use(express.json())
app.use(router);
app.use(express.static("./uploads"));
app.options('*', cors(corsOptions));

app.get("/", checkUser, (req, res) => {
  const username = res.locals.username;
  const response = {
    message: "Welcome to Blog-Tech!",
    isLogedin: username ? true : false,
  };
  if (username) {
    response.username = username;
  }
  res.status(200).json(response);
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.URI);
    console.log("connected to database successfully.");
    app.listen(PORT, () => {
      console.log("Server is started");
    });
  } catch (error) {
    console.log(error);
  }
};
connectDB();
