import mongoose from "mongoose";

export type BalanceModel = mongoose.Document & {
  _id: mongoose.Schema.Types.ObjectId,
  amount: number
};

const balanceSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number,
}, { timestamps: true });

mongoose.model("Balance", balanceSchema);
