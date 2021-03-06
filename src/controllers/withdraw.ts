import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { BalanceModel } from "../models/Balance";
import { WithdrawModel } from "../models/Withdraw";

const Balance = mongoose.model("Balance");
const Withdraw = mongoose.model("Withdraw");

/*
 * POST withdraw
 */
export let postWithdraw = (req: Request, res: Response, next: NextFunction) => {
  const balanceId = req.body.balanceId;
  const amount = req.body.amount;
  const newWithdraw = new Withdraw({
    amount,
    balanceId
  });

  newWithdraw
    .save()
    .then((withdraw: WithdrawModel) => {
      Balance.findOneAndUpdate(
        { _id: withdraw.balanceId },
        { $inc: { amount: -Math.abs(withdraw.amount) } },
        { new: true }
      ).exec((error: Error, balance: BalanceModel) => {
        if (error || !balance) {
          res.status(500);
          return next();
        }
        return res.json({ balance, withdraw });
      });
    })
    .catch((error: Error) => {
      res.status(404);
      return next();
    });
};

/*
 * GET withdraw
 */
export let getWithdraw = (req: Request, res: Response, next: NextFunction) => {
  const withdrawId = req.params.withdrawId;

  Withdraw.findById(withdrawId, (error: Error, withdraw: WithdrawModel) => {
    if (error || !withdraw) {
      res.status(404);
      return next();
    }
    return res.json({ withdraw });
  });
};

export let getWithdraws = (req: Request, res: Response, next: NextFunction) => {
  Withdraw.find(
    {},
    undefined,
    { sort: { createdAt: "desc" } },
    (error: Error, withdraws: Array<WithdrawModel>) => {
      if (error) {
        res.status(500);
        return next();
      }
      return res.json({ withdraws });
    }
  ).catch((error: Error) => {
    return res.status(404).json({ error });
  });
};
