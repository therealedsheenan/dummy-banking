import mongoose from "mongoose";

export type Deposit = mongoose.Document & {
  _id: mongoose.Schema.Types.ObjectId,
  balanceId: mongoose.Schema.Types.ObjectId,
  amount: number
};

const depositSchema = new mongoose.Schema({
  balanceId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number,
}, { timestamps: true });

mongoose.model("Deposit", depositSchema);
