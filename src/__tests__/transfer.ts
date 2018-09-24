import chai from "chai";
import chaiHttp from "chai-http";

import server from "../app";
import Balance, { BalanceModel } from "../models/Balance";
import Transfer, { TransferModel } from "../models/Transfer";

const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

context("dummy-banking transfer API", () => {
  describe("transfer api", () => {
    // Before each test we empty the database
    beforeEach(done => {
      Transfer.remove({});
      Balance.remove({});
      done();
    });

    describe("GET transfers", () => {
      it("GET all transfers", done => {
        chai
          .request(server)
          .get("/api/1.0/transfers")
          .end((error, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            expect(res.body.transfers).to.be.a("array");
            done();
          });
      });

      it("GET transfer via ID - status 200", done => {
        const newBalance1 = new Balance({
          amount: 5000
        });
        const newBalance2 = new Balance({
          amount: 5000
        });
        newBalance1.save();
        newBalance2.save();
        const newTransfer = new Transfer({
          amount: 1000,
          senderBalanceId: newBalance1._id,
          receiverBalanceId: newBalance2._id,
        });

        newTransfer.save((error: Error, transfer: TransferModel) => {
          chai
            .request(server)
            .get(`/api/1.0/transfers/${transfer._id}`)
            .end((error: Error, res) => {
              res.should.have.status(200);
              expect(res.body.transfer).to.be.an("object");
              expect(res.body.transfer.amount).to.equal(1000);
              done();
            });
        });
      });

      it("GET transfer via ID - status 400", done => {
        chai
          .request(server)
          .get("/api/1.0/transfers/dummy_number_here")
          .end((error: Error, res) => {
            res.should.have.status(404);
            done();
          });
      });
    });

    describe("POST transfer", () => {
      it("POST transfer - status 404", done => {
        chai
          .request(server)
          .post("/api/1.0/transfers")
          .type("json")
          .send({})
          .end((error: Error, res) => {
            res.should.have.status(404);
            done();
          });
      });
      it("POST transfer", done => {
        const newBalance1 = new Balance({
          amount: 5000
        });
        const newBalance2 = new Balance({
          amount: 5000
        });
        newBalance1.save();
        newBalance2.save();
        chai
          .request(server)
          .post("/api/1.0/transfers")
          .type("json")
          .send({
            amount: 1000,
            senderBalanceId: newBalance1._id,
            receiverBalanceId: newBalance2._id
          })
          .end((error: Error, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            // balance
            expect(res.body.senderBalance).to.be.an("object");
            expect(res.body.transfer.amount).to.equal(1000);
            expect(res.body.senderBalance.amount).to.equal(4000);
            expect(res.body.receiverBalance.amount).to.equal(6000);
            done();
          });
      });
    });
  });
});
