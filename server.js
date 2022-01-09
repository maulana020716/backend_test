import express from "express";
import cors from "cors";
import restaurantsApi from "./routes/restaurantsApi.route.js";
import restaurants from "./routes/restaurants.route.js";
import crypto from "./routes/crypto.route.js";

import passport from "passport";
import cookieSession from "cookie-session";
import "./passport-setup.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);

app.use(
	cookieSession({
		name: "session",
		keys: ["key1", "key2"],
	})
);

const isLoggedIn = (req, res, next) => {
	if (req.user) {
		next();
	} else {
		res.redirect("/login");
	}
};

app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");

app.use("/api/v1/restaurants", restaurantsApi);
app.use("/restaurants", isLoggedIn, restaurants);
app.use("/crypto", isLoggedIn, crypto);

app.get("/", isLoggedIn, (req, res) => res.send("You are not logged in"));
app.get("/login", (req, res) => res.render("login"));

app.get(
	"/google",
	passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
	"/google/callback",
	passport.authenticate("google", { failureRedirect: "/login" }),
	function (req, res) {
		res.redirect("/restaurants");
	}
);

app.get("/logout", (req, res) => {
	req.session = null;
	req.logout();
	res.redirect("/");
});

app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

export default app;
