import chai from "chai";
import chaiHttp from "chai-http";

import server from "../app";
import Deposit, { DepositModel } from "../models/Deposit";
import Balance, { BalanceModel } from "../models/Balance";

const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

context("dummy-banking deposit API", () => {
  describe("Deposit api", () => {
    // Before each test we empty the database
    beforeEach((done) => {
      Deposit.remove({}, (error: Error) => {
        done();
      });
    });

    it ("GET all deposits", (done) => {
      chai
        .request(server)
        .get("/api/1.0/deposits")
        .end((error, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          expect(res.body.deposits).to.be.a("array");
          done();
        });
    });

    it("GET Deposit via ID", (done) => {
      const newDeposit = new Deposit({
        amount: 5000
      });
      newDeposit.save((error: Error, deposit: DepositModel) => {
        chai
          .request(server)
          .get(`/api/1.0/deposits/${deposit._id}`)
          .end((error: Error, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.deposit.should.be.a("object");
            expect(res.body.deposit.amount).to.equal(5000);
            done();
          });
      });
    });

    it("POST deposit", (done) => {
      const newbalance = new Balance({
        amount: 10000
      });
      newbalance.save((error: Error, balance: BalanceModel) => {
        chai
          .request(server)
          .post("/api/1.0/deposits")
          .type("json")
          .send({
            amount: 10000,
            balanceId: balance._id
          })
          .end((error: Error, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.deposit.should.be.a("object");
            expect(res.body.balance.amount).to.equal(20000);
            expect(res.body.deposit.amount).to.equal(10000);
            done();
          });
      });
    });
  });
});
