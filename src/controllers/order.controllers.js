import Order from "../models/order.models.js"
import User from "../models/auth.models.js";

const addOrder = async (req, res) => {
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
    const order = await Order.create({
      title,
      description,
      price,
      image,
      enrolledUsers,
    });


    if (enrolledUsers) {
      await User.findByIdAndUpdate(enrolledUsers, {
        $push: { enrolledOrders: order._id },
      });
    }

    return res.status(201).json({
      message: "Data added to database and enrolledProducts updated successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error,
    });
  }
};

export default addOrder