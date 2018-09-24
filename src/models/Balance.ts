import mongoose from "mongoose";

import { DepositModel } from "./Deposit";

export type BalanceModel = mongoose.Document & {
  _id: mongoose.Schema.Types.ObjectId;
  amount: number;
  deposits: Array<DepositModel>;
};

const balanceSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    deposits: [{ type: mongoose.Schema.Types.ObjectId, ref: "Deposit" }],
    withdraws: [{ type: mongoose.Schema.Types.ObjectId, ref: "Withdraw" }]
  },
  { timestamps: true }
);

export default mongoose.model("Balance", balanceSchema);
