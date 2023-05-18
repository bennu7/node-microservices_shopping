const express = require("express");
const app = express();
const cors = require("cors");
const proxy = require("express-http-proxy");

app.use(cors());
app.use(express.json());

app.use("/customer", proxy("http://localhost:8001"));
app.use("/shopping", proxy("http://localhost:8003"));
app.use("/products", proxy("http://localhost:8002")); // products

app.use((req, res, next) => {
	return res.status(404).json({ message: "Resource route not found" });
});

app.listen(8000, () => {
	console.log("Gateway service is running on port 8000");
});
