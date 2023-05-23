const express = require("express");
const cors = require("cors");
const { customer, appEvent } = require("./api");
const HandleErrors = require("./utils/error-handler");
const morgan = require("morgan");

module.exports = async (app) => {
	app.use(express.json({ limit: "1mb" }));
	app.use(express.urlencoded({ extended: true, limit: "1mb" }));
	app.use(cors());
	app.use(morgan("dev"));
	app.use(express.static(__dirname + "/public"));

	// app.use((req, res, next) => {
	// 	console.log("🚀 ~ file: express-app.js:13 ~ app.use ~ req:", req);
	// 	next();
	// });

	// Listen to app events
	appEvent(app);

	//api
	customer(app);

	// error handling
	app.use(HandleErrors);
};
