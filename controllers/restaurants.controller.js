import { ObjectId } from "bson";
import RestaurantsModels from "../models/restaurantsModels.js";

export default class RestaurantsController {
	static async GetRestaurants(req, res, next) {
		const restaurantsPerPage = req.query.restaurantsPerPage
			? parseInt(req.query.restaurantsPerPage, 10)
			: 20;
		const page = req.query.page ? parseInt(req.query.page, 10) : 0;

		let filters = {};
		if (req.query.cuisine) {
			filters.cuisine = req.query.cuisine;
		} else if (req.query.zipcode) {
			filters.zipcode = req.query.zipcode;
		} else if (req.query.name) {
			filters.name = req.query.name;
		}

		const { restaurantsList, totalNumRestaurants } =
			await RestaurantsModels.getRestaurants({
				filters,
				page,
				restaurantsPerPage,
			});

		let response = {
			restaurants: restaurantsList,
			page: page,
			filters: filters,
			entries_per_page: restaurantsPerPage,
			total_results: totalNumRestaurants,
		};
		res.render("allRestaurants", { data: response });
		// res.json(response);
	}

	static async apiGetRestaurants(req, res, next) {
		const restaurantsPerPage = req.query.restaurantsPerPage
			? parseInt(req.query.restaurantsPerPage, 10)
			: 20;
		const page = req.query.page ? parseInt(req.query.page, 10) : 0;

		let filters = {};
		if (req.query.cuisine) {
			filters.cuisine = req.query.cuisine;
		} else if (req.query.zipcode) {
			filters.zipcode = req.query.zipcode;
		} else if (req.query.name) {
			filters.name = req.query.name;
		}

		const { restaurantsList, totalNumRestaurants } =
			await RestaurantsModels.getRestaurants({
				filters,
				page,
				restaurantsPerPage,
			});

		let response = {
			restaurants: restaurantsList,
			page: page,
			filters: filters,
			entries_per_page: restaurantsPerPage,
			total_results: totalNumRestaurants,
		};
		// res.render("allRestaurants", { data: response });
		res.json(response);
	}

	static async GetRestaurantById(req, res, next) {
		try {
			let id = req.params.id || {};
			let restaurant = await RestaurantsModels.getRestaurantByID(id);
			if (!restaurant) {
				res.status(404).json({ error: "Not found" });
				return;
			}
			res.render("editRestaurant", { data: restaurant });
			// res.json(restaurant);
		} catch (e) {
			console.log(`api, ${e}`);
			res.status(500).json({ error: e });
		}
	}

	static AddRestaurant(req, res, next) {
		res.render("postRestaurant");
		// res.json(restaurant);
	}

	static async apiGetRestaurantById(req, res, next) {
		try {
			let id = req.params.id || {};
			let restaurant = await RestaurantsModels.getRestaurantByID(id);
			if (!restaurant) {
				res.status(404).json({ error: "Not found" });
				return;
			}
			// res.render("editRestaurant", { data: restaurant });
			res.json(restaurant);
		} catch (e) {
			console.log(`api, ${e}`);
			res.status(500).json({ error: e });
		}
	}

	static async UpdateRestaurant(req, res, next) {
		try {
			let data = {
				_id: req.body._id,
				name: req.body.name,
				building: req.body.building,
				street: req.body.street,
				zipcode: req.body.zipcode,
				borough: req.body.borough,
				rest_id: req.body.restaurant_id,
			};
			const restaurantResponse = await RestaurantsModels.updateRestaurant(
				data
			);

			var { error } = restaurantResponse;
			if (error) {
				res.status(400).json({ error });
			}

			if (restaurantResponse.modifiedCount === 0) {
				throw new Error(restaurantResponse);
			}

			res.send({
				text: "Update success",
				response: data,
			});
		} catch (e) {
			res.status(500).json({ error: e.message });
		}
	}

	static async PostRestaurant(req, res, next) {
		try {
			const _id = new ObjectId();
			const restInfo = {
				_id: _id,
				address: req.body.address,
				building: req.body.building,
				street: req.body.street,
				zipcode: req.body.zipcode,
				borough: req.body.borough,
				cuisine: req.body.cuisine,
				name: req.body.name,
				restaurant_id: req.body.restaurant_id,
			};
			const date = new Date();

			const restaurantResponse = await RestaurantsModels.addRestaurant(
				restInfo
			);
			res.send({ status: "success", response: restInfo._id });
		} catch (e) {
			res.status(500).json({ error: e.message });
		}
	}

	static async DeleteRestaurantById(req, res, next) {
		try {
			const restId = req.body.id;
			const restaurantResponse = await RestaurantsModels.deleteRestaurant(
				restId
			);
			res.json({ status: "success", response: restaurantResponse });
		} catch (e) {
			res.status(500).json({ error: e.message });
		}
	}

	static async apiGetRestaurantCuisines(req, res, next) {
		try {
			let cuisines = await RestaurantsModels.getCuisines();
			res.json(cuisines);
		} catch (e) {
			console.log(`api, ${e}`);
			res.status(500).json({ error: e });
		}
	}
}
