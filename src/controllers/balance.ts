import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { BalanceModel } from "../models/Balance";

const Balance = mongoose.model("Balance");

/*
 * POST balance
 */
export let postBalance = (req: Request, res: Response, next: NextFunction) => {
  const newBalance = new Balance({
    amount: 20000
  });

  newBalance
    .save()
    .then((result: any) => {
      return res.json({
        balance: result
      });
    })
    .catch((error: Error) => {
      res.status(404);
      return next(error);
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
        return next(error);
      }
      return res.json({ balance });
    });
  }

  res.status(404);
  return next();
};
