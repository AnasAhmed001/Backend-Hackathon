import mongoose from "mongoose";
import Data from "../models/data.models.js";


const addData = async (req, res) => {
  const { title, description, price, image } = req.body;

  // Validate required fields
  if (!title || !description) {
    return res.status(400).json({
      message: "title and description are required",
    });
  }

  if (!price) {
    return res.status(400).json({
      message: "price is required",
    });
  }

  if (!image) {
    return res.status(400).json({
      message: "image is required",
    });
  }

  try {
    // Create the data record
    const data = await Data.create({
      title,
      description,
      price,
      image,
    });

    // Respond with success message and created data
    return res.status(201).json({
      message: "data added to database successfully",
      data,
    });
  } catch (error) {
    // Handle any errors during data creation
    return res.status(500).json({
      message: "server error",
      error,
    });
  }
};



const getAllData = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 6;

  const skip = (page - 1) * limit;
  try {
    const datas = await Data.find({}).skip(skip).limit(limit);
    res.status(200).json({
      datas: datas, length: datas.length
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong", details: error.message });
  }
};


const getDataWithId = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Not valid Id" });
  }

  try {
    const data = await Data.findById(id);
    if (!data) {
      return res.status(404).json({
        message: "No data found!",
      });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong", details: error.message });
  }
};

const deleteData = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Not valid ID" });
  }

  try {
    const data = await Data.findOneAndDelete({ _id: id });

    if (!data) {
      return res.status(404).json({ error: "No data found" });
    }

    res.status(200).json({
      message: "Data deleted successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong", details: error.message });
  }
};

const editData = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, image } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const updatedData = await Data.findOneAndUpdate(
      { _id: id },
      { title, description, price, image },
      { new: true, runValidators: true }
    );

    if (!updatedData) {
      return res.status(404).json({ error: "No data found" });
    }

    res.status(200).json({
      message: "Data updated successfully",
      data: updatedData,
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong", details: error.message });
  }
};


export { addData , getAllData , getDataWithId , deleteData, editData };