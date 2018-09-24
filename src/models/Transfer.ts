import mongoose from "mongoose";

export type TransferModel = mongoose.Document & {
  _id: mongoose.Schema.Types.ObjectId;
  amount: number;
  senderBalanceId: mongoose.Schema.Types.ObjectId;
  receiverBalanceId: mongoose.Schema.Types.ObjectId;
};

const transferSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    senderBalanceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Balance",
      required: true
    },
    receiverBalanceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Balance",
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Transfer", transferSchema);
