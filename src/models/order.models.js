import mongoose from "mongoose";

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    orderDate: {
      type: Date,
      default: Date.now()
    },
    status: {
      type: String,
      enum: ["pending", "completed", "shipped"],
      default: "pending"
    },
    enrolledUsers: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users'
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", orderSchema);