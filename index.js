import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./src/db/index.js";
import authRoutes from "./src/routes/auth.routes.js";
import dataRoutes from "./src/routes/data.routes.js";
import orderRoutes from "./src/routes/order.routes.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// routes
app.use("/api/v1", authRoutes);
app.use("/api/v1", dataRoutes);
app.use("/api/v1", orderRoutes);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`⚙️  Server is running at port : ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO DB connection failed !!! ", err);
  });