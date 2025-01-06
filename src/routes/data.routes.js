import express from "express";
import { addData , getAllData , getDataWithId , deleteData , editData } from "../controllers/data.controllers.js";

const router = express.Router();

router.post("/data", addData);
router.get("/allData", getAllData);
router.get("/data/:id", getDataWithId);
router.delete("/data/:id", deleteData);
router.put("/data/:id", editData);


export default router;