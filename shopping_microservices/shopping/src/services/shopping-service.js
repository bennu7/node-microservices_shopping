const { ShoppingRepository } = require("../database");
const { FormateData } = require("../utils");
const { APIError } = require("../utils/app-errors");
const randomString = require("randomstring");

// All Business logic will be here
class ShoppingService {
	constructor() {
		this.repository = new ShoppingRepository();
	}

	async getCart({ id }) {
		try {
			const cartItems = await this.repository.Cart(id);

			return FormateData(cartItems);
		} catch (err) {
			throw new APIError("GET CART not found", 404);
		}
	}

	async PlaceOrder(_id) {
		// const { _id } = userInput;
		// Verify the txn number with payment logs
		const txnId = randomString.generate({
			length: 10,
			capitalization: "uppercase",
		});

		try {
			const orderResult = await this.repository.CreateNewOrder(_id, txnId);
			return FormateData(orderResult);
		} catch (err) {
			throw new APIError("Data Not found", err);
		}
	}

	async GetOrders(customerId) {
		try {
			const orders = await this.repository.Orders(customerId);
			return FormateData(orders);
		} catch (err) {
			throw new APIError("Data Not found", err);
		}
	}

	// get order details
	async ManageCart(customerId, item, qty, isRemove) {
		try {
			const cartResult = await this.repository.AddCartItem(
				customerId,
				item,
				qty,
				isRemove
			);

			return FormateData(cartResult);
		} catch (err) {
			throw err;
		}
	}

	async SubscribeEvents(payload) {
		const { event, data } = payload;

		const { userId, product, qty } = data;

		switch (event) {
			case "ADD_TO_CART":
				this.ManageCart(userId, product, qty, false);
				break;
			case "REMOVE_FROM_CART":
				this.ManageCart(userId, product, qty, true);
				break;
			default:
				break;
		}
	}

	async GetOrderPayload({ userId, event, order }) {
		if (order) {
			const payload = {
				event,
				data: { userId, order },
			};

			return payload;
		} else {
			return FormateData({ error: "No Order is Available" });
		}
	}
}

module.exports = ShoppingService;
