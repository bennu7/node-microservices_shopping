const axios = require("axios");

// *NOTE: temporarily this communication service use http like axios, not yet entered to message queue
// communicate product with customer
module.exports.PublishCustomerEvent = async (payload) => {
	// connect to gateway
	await axios.post("http://localhost:8000/customer/app-events", { payload });
};
