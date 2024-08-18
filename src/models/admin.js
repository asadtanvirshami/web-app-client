import mongoose, { Schema } from "mongoose";

const adminSchema = new Schema(
  {
    fname: String,
    lname: String,
    username: String,
    email: String,
    password: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Admin ?? mongoose.model("Admin", adminSchema);
