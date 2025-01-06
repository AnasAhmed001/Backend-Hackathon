import User from "../models/auth.models.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadImageToCloudinary = async (localPath) => {
  try {
      const result = await cloudinary.uploader.upload(localPath, {
          resource_type: "auto",
      });
      fs.unlinkSync(localPath);
      return result.url;
  } catch (err) {
      return fs.unlinkSync(localPath);
  };
};


const uploadImage = async (req, res) => {
  if (!req.file) return res.status(400).json({
      message: "no image file uploaded",
  });
  
  try {
      const uploadResult = await uploadImageToCloudinary(req.file.path);
      if (!uploadResult) return res.status(500).json({
          message: "error occured while uploading image"
      });

      res.json({
          message: "image uploaded successfully",
          url: uploadResult,
      });
  }
  catch (error) {
      console.log(error);
      res.status(500).json({ message: "error occured while uploading image" });
  }
}



const generateAccessToken = (user) => {
  return jwt.sign({ email: user.email }, process.env.ACCESS_JWT_SECRET, {
  expiresIn: "6h",
  });
};
const generateRefreshToken = (user) => {
  return jwt.sign({ email: user.email }, process.env.REFRESH_JWT_SECRET, {
    expiresIn: "7d",
  });
};



const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  // Validate inputs
  if (!userName) return res.status(400).json({ message: "username required" });
  if (!email) return res.status(400).json({ message: "email required" });
  if (!password) return res.status(400).json({ message: "password required" });

  try {
    // Check if user already exists
    const user = await User.findOne({ email });
    if (user) return res.status(401).json({ message: "user already exists" });

    // Create new user
    const createUser = await User.create({
      userName,
      email,
      password,
    });

    // Generate tokens
    const accessToken = generateAccessToken(createUser);
    const refreshToken = generateRefreshToken(createUser);

    // Set refresh token in cookie
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false });

    // Return response with tokens and user data
    res.json({
      message: "user registered and logged in successfully",
      accessToken,
      refreshToken,
      data: {
        userName: createUser.userName,
        email: createUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "server error", error });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate inputs
  if (!email) return res.status(400).json({ message: "email required" });
  if (!password) return res.status(400).json({ message: "password required" });

  try {
    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "no user found" });

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "incorrect password" });

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Set refresh token in cookie
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false });

    // Return response with tokens and user data
    res.json({
      message: "user logged in successfully",
      accessToken,
      refreshToken,
      data: {
        userName: user.userName,
        email: user.email,
        password: user.password,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "server error", error });
  }
};




const logoutUser = async (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "user logout successfully" });
};

const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ message: "no refresh token found!" });
  const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);
  const user = await User.findOne({ email: decodedToken.email });
  if (!user) return res.status(404).json({ message: "invalid token" });
  const generateToken = generateAccessToken(user);
  res.json({ message: "access token generated", accesstoken: generateToken });
  res.json({ decodedToken });
};


export {registerUser , loginUser , logoutUser , refreshToken , uploadImage}



