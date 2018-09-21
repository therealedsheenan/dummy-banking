import express, { Request, Response } from "express";
import * as balance from "../../controllers/balance";

const router = express.Router();

// sample alive message
router.get("/", (req: Request, res: Response) =>
  res.json({ message: "Alive!" })
);

// balance
router.get("/balances/:balanceId", balance.getBalance);
router.post("/balances", balance.postBalance);

export default router;
