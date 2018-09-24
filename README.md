# dummy-banking [![CircleCI](https://circleci.com/gh/therealedsheenan/dummy-banking/tree/master.svg?style=svg)](https://circleci.com/gh/therealedsheenan/dummy-banking/tree/master)
A dummy api for basic banking

### Installation

##### With Docker
Make sure you install docker in your local machine.
Checkout docker website for more information.
https://docs.docker.com/install/

By simply running this command, it will install all the dependencies under the hood
and get you up and running in development environment.

```
$ docker-compose up
```

##### Without docker
```
$ yarn install # installing dependencies
$ yarn build # build typescript
$ yarn watch-debug # watch mode node and typescript
```

Checkout `npm scripts` for other commands.

### Testing

```
$ yarn test # run testing suite
```

#### API Routes
```
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
```
