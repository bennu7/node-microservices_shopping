const ShoppingService = require("../services/shopping-service");
// const UserService = require("../services/customer-service");
const UserAuth = require("./middlewares/auth");
const { PublishCustomerEvent } = require("../utils/communication-service");

module.exports = (app) => {
	const service = new ShoppingService();
	// const userService = new UserService();

	app.post("/order", UserAuth, async (req, res, next) => {
		const { _id } = req.user;

		try {
			const { data } = await service.PlaceOrder(_id);
			console.log("result data service.PlaceOrder(_id) => ", typeof data, data);

			const payload = await service.GetOrderPayload({
				userId: _id,
				event: "CREATE_ORDER",
				order: data,
			});

			await PublishCustomerEvent(payload);

			return res.status(200).json(data);
		} catch (err) {
			next(err);
		}
	});

	app.get("/orders", UserAuth, async (req, res, next) => {
		const { _id } = req.user;

		try {
			const { data } = await service.GetOrders(_id);

			return res.status(200).json(data);
		} catch (err) {
			next(err);
		}
	});

	app.get("/cart", UserAuth, async (req, res, next) => {
		const { _id } = req.user;
		try {
			const { data } = await service.getCart({ id: _id });
			console.log("data get /cart", data);

			return res.status(200).json(data);
		} catch (err) {
			next(err);
		}
	});
};
