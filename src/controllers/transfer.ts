import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { BalanceModel } from "../models/Balance";
import { TransferModel } from "../models/Transfer";

const Balance = mongoose.model("Balance");
const Transfer = mongoose.model("Transfer");

/*
 * POST transfer
 */
export let postTransfer = (req: Request, res: Response, next: NextFunction) => {
  const receiverBalanceId = req.body.receiverBalanceId;
  const senderBalanceId = req.body.senderBalanceId;
  const amount = req.body.amount;

  const newTransfer = new Transfer({
    amount,
    senderBalanceId,
    receiverBalanceId
  });

  // check if sender and receiver is existing
  Promise.all([getBalance(senderBalanceId), getBalance(receiverBalanceId)])
    .then((balances: Array<object>) => {
      newTransfer
        .save()
        .then((transfer: TransferModel) => {
          const currentTransfer = transfer;
          Promise.all([
            updateBalance(senderBalanceId, -Math.abs(transfer.amount)),
            updateBalance(receiverBalanceId, transfer.amount)
          ])
            .then((balances: Array<object>) => {
              // transfer of balances successful
              return res.json({
                transfer: currentTransfer,
                senderBalance: balances[0],
                receiverBalance: balances[1]
              });
            })
            .catch((error: Error) => {
              // unable to udpate sender"s or receiver"s balance
              res.status(500);
              return next();
            });
        })
        .catch((error: Error) => {
          res.status(404);
          return next();
        });
    })
    .catch((error: Error) => {
      // one of the balance ids is not found
      res.status(404);
      return next();
    });
};

/*
 * GET deposit
 */
export let getTransfer = (req: Request, res: Response, next: NextFunction) => {
  const transferId = req.params.transferId;

  Transfer.findById(transferId, (error: Error, transfer: TransferModel) => {
    if (error || !transfer) {
      res.status(404);
      return next();
    }
    return res.json({ transfer });
  });
};

export let getTransfers = (req: Request, res: Response, next: NextFunction) => {
  Transfer.find(
    {},
    undefined,
    { sort: { createdAt: "desc" } },
    (err, transfers: Array<TransferModel>) => {
      if (err) {
        res.status(500);
        return next();
      }
      return res.json({ transfers });
    }
  ).catch((error: Error) => {
    return res.status(404).json({ error });
  });
};

// check whether a specific balanceId exist
// resolves the promise it exists, otherwise reject
const getBalance = (balanceId: number) =>
  new Promise((resolve, reject) => {
    Balance.findById(balanceId, (error: Error, balance: BalanceModel) => {
      if (error || !balance) {
        return reject();
      }
      return resolve(balance);
    });
  });

// utility function for updating receiver and sender balances
const updateBalance = (balanceId: number, amount: number) => {
  return new Promise((resolve, reject) => {
    Balance.findOneAndUpdate(
      { _id: balanceId },
      { $inc: { amount: amount } },
      { new: true }
    ).exec((error: Error, balance: BalanceModel) => {
      if (error || !balance) {
        return reject();
      }
      return resolve(balance);
    });
  });
};
