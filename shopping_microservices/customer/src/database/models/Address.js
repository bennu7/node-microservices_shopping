const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AddressSchema = new Schema(
	{
		street: String,
		postalCode: String,
		city: String,
		country: String,
	},
	{ timestamps: true }
);

mongoose.set("debug", true);
module.exports = mongoose.model("address", AddressSchema);
