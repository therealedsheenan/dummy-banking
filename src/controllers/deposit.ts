import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { DepositModel } from "../models/Deposit";
import { BalanceModel } from "../models/Balance";

const Deposit = mongoose.model("Deposit");
const Balance = mongoose.model("Balance");

/*
 * POST deposit
 */
export let postDeposit = (req: Request, res: Response, next: NextFunction) => {
  const balanceId = req.body.balanceId;
  const amount = req.body.amount;
  if (balanceId) {
    const newDeposit = new Deposit({
      amount,
      balanceId
    });

    newDeposit
      .save()
      .then((deposit: DepositModel) => {
        Balance.findOneAndUpdate(
          { _id: deposit.balanceId },
          { $inc: { amount: deposit.amount } },
          { new: true }
        ).exec((error: Error, balance: BalanceModel) => {
          if (error || !balance) {
            return next(error);
          }
          return res.json({ balance, deposit });
        });
      })
      .catch((error: Error) => {
        res.status(404);
        return next();
      });
  }
};

/*
 * GET deposit
 */
export let getDeposit = (req: Request, res: Response, next: NextFunction) => {
  const depositId = req.params.depositId;

  if (depositId) {
    Deposit.findById(depositId, (error: Error, deposit: DepositModel) => {
      if (error || !deposit) {
        res.status(404);
        return next();
      }
      return res.json({ deposit });
    });
  }
};

export let getDeposits = (req: Request, res: Response, next: NextFunction) => {
  Deposit.find(
    {},
    undefined,
    { sort: { createdAt: "desc" } },
    (err, deposits: Array<DepositModel>) => {
      if (err) {
        return next(err);
      }
      return res.json({ deposits });
    }
  ).catch(err => {
    return res.status(500).json({ error: err });
  });
};
