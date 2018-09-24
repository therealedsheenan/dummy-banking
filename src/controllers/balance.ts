import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { BalanceModel } from "../models/Balance";

const Balance = mongoose.model("Balance");

/*
 * POST balance
 */
export let postBalance = (req: Request, res: Response, next: NextFunction) => {
  const newBalance = new Balance({
    amount: req.body.amount
  });

  newBalance
    .save()
    .then((balance: BalanceModel) => {
      return res.json({ balance });
    })
    .catch((error: Error) => {
      res.status(404);
      return next();
    });
};

/*
 * GET balance
 */
export let getBalance = (req: Request, res: Response, next: NextFunction) => {
  const balanceId = req.params.balanceId;

  if (balanceId) {
    Balance.findById(balanceId, (error: Error, balance: BalanceModel) => {
      if (error || !balance) {
        res.status(404);
        return next();
      }
      return res.json({ balance });
    });
  } else {
    return next(res.status(404));
  }
};

export let getBalances = (req: Request, res: Response, next: NextFunction) => {

  Balance
    .find(
      {},
      undefined,
      { sort: { "createdAt": "desc" } },
      (error: Error, balances: Array<BalanceModel>) => {
        if (error) { return next(error); }
        return res.json({ balances });
      })
    .catch((error: Error) => {
      return res.status(500).json({  error: error  });
    });
};
