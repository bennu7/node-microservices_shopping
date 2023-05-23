const express = require("express");
const cors = require("cors");
const { products, appEvents } = require("./api");
const HandleErrors = require("./utils/error-handler");
const morgan = require("morgan");

module.exports = async (app) => {
	app.use(express.json({ limit: "1mb" }));
	app.use(express.urlencoded({ extended: true, limit: "1mb" }));
	app.use(cors());
	app.use(express.static(__dirname + "/public"));
	app.use(morgan("dev"));

	// Listeners
	appEvents(app);

	//api
	products(app);

	// error handling
	app.use(HandleErrors);
	app.use((req, res, next) => {
		return res
			.status(404)
			.json({ message: "Resource PRODUCT route not found" });
	});
};
