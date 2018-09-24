import createError from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import logger from "morgan";
import lusca from "lusca";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import session from "express-session";
import cors from "cors";
import mongoose from "mongoose";

// models
import "./models/Deposit";
import "./models/Balance";
import "./models/Withdraw";
import "./models/Transfer";

const app = express();

// port
app.set("port", process.env.PORT || 8000);

// load environment variables
dotenv.config({ path: ".env" });

const isProduction = process.env.NODE_ENV === "production";

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// cors
app.use(cors());

// database
// mongo database
if (isProduction) {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect("mongodb://localhost/dummy-banking");
  mongoose.set("debug", true);
}

// bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// express sessions
app.use(
  session({
    secret: "CHANGE_THIS_PROPERTY_TO_DOTENV_VALUE",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
);

// security
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));

// routes
import routes from "./routes/";
app.use(routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// will print stacktrace
if (!isProduction) {
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err.stack);

    res.status(err.status || 500);

    res.json({
      errors: {
        message: err.message,
        error: err
      }
    });
  });
}

// production error handler
// no stack traces leaked to user
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: {}
    }
  });
});

// error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  next(err);
});

export default app;
