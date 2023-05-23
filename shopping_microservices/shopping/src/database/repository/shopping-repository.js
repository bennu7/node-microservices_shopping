const {
	CustomerModel,
	ProductModel,
	OrderModel,
	CartModel,
} = require("../models");
const { v4: uuidv4 } = require("uuid");
const { APIError, BadRequestError } = require("../../utils/app-errors");
const { STATUS_CODES } = require("../../utils/app-errors");

//Dealing with data base operations
class ShoppingRepository {
	// payment

	async Orders(customerId) {
		try {
			const orders = await OrderModel.find({ customerId });

			return orders;
		} catch (err) {
			throw APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				"Unable to Find Orders"
			);
		}
	}

	async Cart(customerId) {
		try {
			const cartItems = await CartModel.find({ customerId });
			if (cartItems[0].items.length == 0) {
				return [];
			}

			return cartItems;
		} catch (error) {
			throw error;
		}
	}

	// *is this same function repository from customer-repository
	async AddCartItem(customerId, item, qty, isRemove) {
		try {
			const cart = await CartModel.findOne({ customerId });
			const { _id } = item;

			if (cart) {
				let isExist = false;
				let cartItems = cart.items;

				if (cartItems.length > 0) {
					cartItems.map((item) => {
						if (item.product._id.toString() === _id.toString()) {
							if (isRemove) {
								cartItems.splice(cartItems.indexOf(item), 1);
							} else {
								item.unit = qty;
							}
							isExist = true;
						}
					});
				}

				if (!isExist && !isRemove) {
					cartItems.push({ product: { ...item }, unit: qty });
				}

				cart.items = cartItems;

				return await cart.save();
			} else {
				return await CartModel.create({
					customerId,
					items: [
						{
							product: { ...item },
							unit: qty,
						},
					],
				});
			}
		} catch (err) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				"Unable to Create Customer"
			);
		}
	}

	async CreateNewOrder(customerId, txnId) {
		//check transaction for payment Status

		try {
			const cart = await CartModel.findOne({
				customerId,
			});

			if (cart) {
				let cartItems = cart.items;
				let amount = 0;

				if (cartItems.length > 0) {
					//process Order
					cartItems.map((item) => {
						amount += parseInt(item.product.price) * parseInt(item.unit);
					});
					console.log(
						"🚀 ~ file: shopping-repository.js:109 ~ ShoppingRepository ~ cartItems.map ~ amount:",
						amount
					);

					const orderId = uuidv4();

					const order = new OrderModel({
						orderId,
						customerId,
						amount,
						txnId,
						status: "received",
						items: cartItems,
					});

					cart.items = [];

					const orderResult = await order.save();

					// cart.items.push(orderResult);

					await cart.save();

					return orderResult;
				}
			}

			return {};
		} catch (err) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				"Unable to Find Category"
			);
		}
	}
}

module.exports = ShoppingRepository;
