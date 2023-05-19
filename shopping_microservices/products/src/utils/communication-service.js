const axios = require("axios");

// *NOTE: temporarily this communication service use http like axios, not yet entered to message queue
// communicate product with customer
module.exports.PublishCustomerEvent = async (payload) => {
	// connect to gateway
	axios.post("http://localhost:8000/customer/app-events", { payload });
};

// communicate product with shopping
module.exports.PublishShoppingEvent = async (payload) => {
	axios.post("http://localhost:8000/shopping/app-events", { payload });
};
