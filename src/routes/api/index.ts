import express, { Request, Response } from "express";
import * as balance from "../../controllers/balance";
import * as deposit from "../../controllers/deposit";
import * as withdraw from "../../controllers/withdraw";
import * as transfer from "../../controllers/transfer";

const router = express.Router();

// sample alive message
router.get("/", (req: Request, res: Response) =>
  res.send("Alive!")
);

// balance
router.get("/balances", balance.getBalances);
router.get("/balances/:balanceId", balance.getBalance);
router.post("/balances", balance.postBalance);

// deposit
router.get("/deposits", deposit.getDeposits);
router.get("/deposits/:depositId", deposit.getDeposit);
router.post("/deposits", deposit.postDeposit);

// withdraw
router.get("/withdraws", withdraw.getWithdraws);
router.get("/withdraws/:withdrawId", withdraw.getWithdraw);
router.post("/withdraws", withdraw.postWithdraw);

// transfers
router.get("/transfers", transfer.getTransfers);
router.get("/transfers/:transferId", transfer.getTransfer);
router.post("/transfers", transfer.postTransfer);

export default router;
