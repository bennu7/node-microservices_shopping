const express = require("express");
const app = express();

app.use(express.json());

app.use("/", (req, res, next) => {
	return res.status(200).json({ message: "Products service is running" });
});

app.listen(8002, () => {
	console.log("Products service is running on port 8002");
});
