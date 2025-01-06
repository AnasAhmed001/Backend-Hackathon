import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectDB from "./src/db/index.js";
import authRoutes from "./src/routes/auth.routes.js";
import dataRoutes from "./src/routes/data.routes.js";
import courseRoute from "./src/routes/course.routes.js";
import studentRoute from "./src/routes/student.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// routes
app.use("/api/v1", authRoutes);
app.use("/api/v1", dataRoutes);
app.use("/api/v1", courseRoute);
app.use("/api/v1", studentRoute);

connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`⚙️  Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO DB connection failed !!! ", err);
  });