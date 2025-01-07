import mongoose from "mongoose";
import Data from "../models/data.models.js";
import User from "../models/auth.models.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: 'meggie.prohaska20@ethereal.email',
    pass: 'dRvDAVcP9QQf9ekvMS'
  },
});


const sendEmail = async (req, res) => {
  const info = await transporter.sendMail({
    from: '"		Meggie Prohaska 👻" <meggie.prohaska20@ethereal.email>',
    to: "mohammadasadiam64@gmail.com",
    subject: "Congratulations! Internship Opportunity at Systems Limited",
    html: "<b>We are thrilled to inform you that you have been selected for the MERN Stack Developer Internship at Systems Limited. Your skills and passion for full-stack development have impressed us, and we are excited to have you on board as part of our dynamic team.</b>",
  });

  console.log("Message sent: %s", info.messageId);
  res.send(info);
};



const addData = async (req, res) => {
  const { title, description, price, image, enrolledUsers } = req.body;


  if (!title || !description) {
    return res.status(400).json({
      message: "Title and description are required",
    });
  }

  if (!price) {
    return res.status(400).json({
      message: "Price is required",
    });
  }

  if (!image) {
    return res.status(400).json({
      message: "Image is required",
    });
  }

  try {
    const data = await Data.create({
      title,
      description,
      price,
      image,
      enrolledUsers,
    });


    if (enrolledUsers) {
      await User.findByIdAndUpdate(enrolledUsers, {
        $push: { enrolledProducts: data._id },
      });
    }

    return res.status(201).json({
      message: "Data added to database and enrolledProducts updated successfully",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
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
      datas: datas,
      length: datas.length,
    });
  } catch (error) {
    res.status(500).json({
      error: "Something went wrong",
      details: error.message,
    });
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

    res.status(200).json({
      message: "Data fetched successfully",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      error: "Something went wrong",
      details: error.message,
    });
  }
};

const deleteData = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Not valid ID" });
  }

  try {
    const data = await Data.findByIdAndDelete(id);

    if (!data) {
      return res.status(404).json({ error: "No data found" });
    }

    await User.updateMany(
      { enrolledProducts: id },
      { $pull: { enrolledProducts: id } }
    );

    res.status(200).json({
      message: "Data deleted successfully and removed from enrolledProducts",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      error: "Something went wrong",
      details: error.message,
    });
  }
};


const editData = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, image } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const updatedData = await Data.findByIdAndUpdate(
      id,
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
    res.status(500).json({
      error: "Something went wrong",
      details: error.message,
    });
  }
};



export { addData, getAllData, getDataWithId, deleteData, editData, sendEmail };