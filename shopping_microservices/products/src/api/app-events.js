module.exports = (app) => {
	app.use("/app-events", async (req, res, next) => {
		const { payload } = req.body;

		console.log("======== Product Services received Event ========");

		return res.status(200).json({ message: "Event received", payload });
	});
};
