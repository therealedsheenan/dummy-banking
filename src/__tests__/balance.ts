import chai from "chai";
import chaiHttp from "chai-http";

import server from "../app";
import Balance, { BalanceModel } from "../models/Balance";

const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

context("dummy-banking API", () => {
  describe("balance api", () => {
    // Before each test we empty the database
    beforeEach((done) => {
      Balance.remove({}, (error: Error) => {
        done();
      });
    });

    it ("GET all balances", (done) => {
      chai
        .request(server)
        .get("/api/1.0/balances")
        .end((error, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          expect(res.body.balances).to.be.a("array");
          done();
        });
    });

    it("GET balance via ID", (done) => {
      const newBalance = new Balance({
        amount: 5000
      });
      newBalance.save((error: Error, balance: BalanceModel) => {
        chai
          .request(server)
          .get(`/api/1.0/balances/${balance._id}`)
          .end((error: Error, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.balance.should.be.a("object");
            expect(res.body.balance.amount).to.equal(5000);
            done();
          });
      });
    });
  });
});
