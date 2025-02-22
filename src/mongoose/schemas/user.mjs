import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type : mongoose.Schema.Types.String,
    required: true,
    unique: true
  },
  username: mongoose.Schema.Types.String,
})