import mongoose from "mongoose";

export type DepositModel = mongoose.Document & {
  _id: mongoose.Schema.Types.ObjectId,
  balanceId: mongoose.Schema.Types.ObjectId,
  amount: number
};

const depositSchema = new mongoose.Schema({
  balanceId: { type: mongoose.Schema.Types.ObjectId, ref: "Balance" },
  amount: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model("Deposit", depositSchema);
