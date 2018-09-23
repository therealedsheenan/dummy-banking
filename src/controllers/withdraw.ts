import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { DepositModel } from "../models/Deposit";
import { BalanceModel } from "../models/Balance";
import { WithdrawModel } from "../models/Withdraw";

const Deposit = mongoose.model("Deposit");
const Balance = mongoose.model("Balance");
const Withdraw = mongoose.model("Withdraw");

/*
 * POST withdraw
 */
export let postWithdraw = (req: Request, res: Response, next: NextFunction) => {
  const balanceId = req.body.balanceId;
  const amount = req.body.amount;
  if (balanceId) {
    const newWithdraw = new Withdraw({
      amount,
      balanceId
    });

    newWithdraw
      .save()
      .then((withdraw: WithdrawModel) => {
        Balance
          .findOneAndUpdate(
            { _id: withdraw.balanceId },
            { $inc: { amount: -Math.abs(withdraw.amount) } }
          ).exec((error: Error, balance: BalanceModel) => {
          if (error || !balance) {
            return next(error);
          }
          return res.json({ balance, withdraw });
        });
      })
      .catch((error: Error) => {
        res.status(404);
        return next(error);
      });
  }
};

/*
 * GET withdraw
 */
export let getWithdraw = (req: Request, res: Response, next: NextFunction) => {
  const withdrawId = req.params.withdrawId;

  if (withdrawId) {
    Withdraw.findById(withdrawId, (error: Error, withdraw: WithdrawModel) => {
      if (error || !withdraw) {
        res.status(404);
        return next(error);
      }
      return res.json({ withdraw });
    });
  }
};

export let getWithdraws = (req: Request, res: Response, next: NextFunction) => {
  Withdraw
    .find(
      {},
      undefined,
      { sort: { "createdAt": "desc" } },
      (err, withdraws: Array<WithdrawModel>) => {
        if (err) { return next(err); }
        return res.json({ withdraws });
      })
    .catch((err) => {
      return res.status(500).json({  error: err  });
    });
};
