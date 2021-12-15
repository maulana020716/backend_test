import express from "express";
import cors from "cors";
import restaurantsApi from "./routes/restaurantsApi.route.js";
import restaurants from "./routes/restaurants.route.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);
app.set("view engine", "ejs");

app.use("/api/v1/restaurants", restaurantsApi);
app.use("/restaurants", restaurants);
app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

export default app;
