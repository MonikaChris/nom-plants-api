"use strict";

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const Handler = require("./modules/handlers");
const registerUser = require("./modules/register");
const authenticateUser = require("./modules/auth");
const refreshJWT = require("./modules/refresh");
const logout = require("./modules/logout");
const verifyJWT = require("./middleware/verifyJWT");

mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Mongoose is connected to Atlas!");
});

const app = express();

//CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_DOMAIN,
  methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
  credentials: true, //allows cookies to be sent with requests
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

const PORT = process.env.PORT;

// Home/test route
app.get("/", (req, res) => {
  res.send("Testing...");
});

app.post("/api/register", registerUser);
app.post("/api/auth", authenticateUser);
app.get("api/refresh", refreshJWT);
app.post("api/logout", logout);
app.get("/api/demo/:date", Handler.getDemoData);

app.use(verifyJWT);
app.get("/api/weeks/:weekStartDate", Handler.getWeek);
app.post("/api/weeks/:weekStartDate/plants/:plant", Handler.addPlant);
app.put("/api/weeks/:weekStartDate/plants/:plant", Handler.updatePlant);

app.use((error, req, res, next) => {
  res.status(500).send(error.message);
});

app.listen(PORT, console.log(`Listening...`));
