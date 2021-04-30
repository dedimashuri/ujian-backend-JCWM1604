"use strict";
const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const bearerToken = require("express-bearer-token");
app.use(bearerToken());
app.use(
  cors({
    exposedHeaders: [
      "Content-Length",
      "x-token-access",
      "x-token-refresh",
      "x-total-count",
    ],
  })
);

const morgan = require("morgan");
morgan.token("date", function (req, res) {
  return new Date();
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :date")
);
const PORT = 2000;
app.use(express.urlencoded({ extended: false }));

app.use(express.json());
//? menyediakan file statis
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("<h1>REST API JCWM1604</h1>");
});

const { AuthRoutes, MovieRoutes } = require("./src/routers");

app.use("/user", AuthRoutes);
app.use("/movies", MovieRoutes);

app.all("*", (req, res) => {
  res.status(404).send("resource not found");
});

app.listen(PORT, () => console.log(`CONNECTED : port ${PORT}`));
