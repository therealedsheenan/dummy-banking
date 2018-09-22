import mongoose from "mongoose";

export type WithdrawModel = mongoose.Document & {
  _id: mongoose.Schema.Types.ObjectId,
  amount: number,
  balanceId: mongoose.Schema.Types.ObjectId
};

const withdrawSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  balanceId: { type: mongoose.Schema.Types.ObjectId, ref: "Balance" },
}, { timestamps: true });

mongoose.model("Withdraw", withdrawSchema);
