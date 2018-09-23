import express, { Request, Response } from "express";
import * as balance from "../../controllers/balance";
import * as deposit from "../../controllers/deposit";
import * as withdraw from "../../controllers/withdraw";

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

export default router;
