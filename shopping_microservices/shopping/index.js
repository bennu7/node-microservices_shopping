const express = require("express");
const app = express();

app.use(express.json());

app.use("/", (req, res, next) => {
	return res.status(200).json({ message: "Shopping service is running" });
});

app.listen(8003, () => {
	console.log("Shopping service is running on port 8003");
});
