import chai from "chai";
import chaiHttp from "chai-http";

import server from "../app";
import Withdraw, { WithdrawModel } from "../models/Withdraw";
import Balance, { BalanceModel } from "../models/Balance";

const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

context("dummy-banking withdraw API", () => {
  describe("withdraw api", () => {
    // Before each test we empty the database
    beforeEach(done => {
      Withdraw.remove({}, (error: Error) => {
        done();
      });
    });

    describe("GET withdraws", () => {
      it("GET all withdraws", done => {
        chai
          .request(server)
          .get("/api/1.0/withdraws")
          .end((error, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            expect(res.body.withdraws).to.be.a("array");
            done();
          });
      });

      it("GET withdraw via ID - status 200", done => {
        const newBalance = new Balance({
          amount: 1000
        });
        // saving a dummy balance
        newBalance.save((error: Error, balance: BalanceModel) => {
          const newWithdraw = new Withdraw({
            amount: 5000,
            balanceId: balance._id
          });
          newWithdraw.save((error: Error, withdraw: WithdrawModel) => {
            chai
              .request(server)
              .get(`/api/1.0/withdraws/${withdraw._id}`)
              .end((error: Error, res) => {
                res.should.have.status(200);
                res.body.should.be.a("object");
                res.body.withdraw.should.be.a("object");
                expect(res.body.withdraw.amount).to.equal(5000);
                done();
              });
          });
        });
      });
      it("GET withdraw via ID - status 404", done => {
        const newBalance = new Balance({
          amount: 1000
        });
        // saving a dummy balance
        newBalance.save((error: Error, balance: BalanceModel) => {
          const newWithdraw = new Withdraw({
            amount: 5000,
            balanceId: balance._id
          });
          newWithdraw.save((error: Error, withdraw: WithdrawModel) => {
            chai
              .request(server)
              .get("/api/1.0/withdraws/dummy_withdraw")
              .end((error: Error, res) => {
                res.should.have.status(404);
                done();
              });
          });
        });
      });
    });

    describe("POST withdraw", () => {
      it("POST withdraw - status 200", done => {
        const newBalance = new Balance({
          amount: 10000
        });
        // saving a dummy balance
        newBalance.save((error: Error, balance: BalanceModel) => {
          chai
            .request(server)
            .post("/api/1.0/withdraws")
            .type("json")
            .send({
              balanceId: balance._id,
              amount: 5000
            })
            .end((error: Error, res) => {
              res.should.have.status(200);
              res.body.should.be.a("object");
              // balance object
              res.body.balance.should.be.a("object");
              // withdraw object
              res.body.withdraw.should.be.a("object");
              expect(res.body.balance.amount).to.equal(5000);
              done();
            });
        });
      });
      it("POST withdraw - status 404", done => {
        const newBalance = new Balance({ amount: 1000 });
        // saving a dummy balance
        newBalance.save((error: Error, balance: BalanceModel) => {
          chai
            .request(server)
            .post("/api/1.0/withdraws")
            .type("json")
            .send({ balanceId: balance._id })
            .end((error: Error, res) => {
              res.should.have.status(404);
              done();
            });
        });
      });
    });
  });
});
