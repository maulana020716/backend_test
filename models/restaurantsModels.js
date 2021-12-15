import mongodb from "mongodb";
const ObjectId = mongodb.ObjectID;
let restaurants;

export default class RestaurantsModels {
	static async injectDB(conn) {
		if (restaurants) {
			return;
		}
		try {
			restaurants = await conn
				.db(process.env.RESTREVIEWS_NS)
				.collection("restaurants");
		} catch (e) {
			console.error(
				`Unable to establish a collection handle in restaurantsModels: ${e}`
			);
		}
	}

	static async getRestaurants({
		filters = null,
		page = 0,
		restaurantsPerPage = 20,
	} = {}) {
		let query;
		if (filters) {
			if ("name" in filters) {
				query = { $text: { $search: filters["name"] } };
			} else if ("cuisine" in filters) {
				query = { cuisine: { $eq: filters["cuisine"] } };
			} else if ("zipcode" in filters) {
				query = { "address.zipcode": { $eq: filters["zipcode"] } };
			}
		}

		let cursor;

		try {
			cursor = await restaurants.find(query);
		} catch (e) {
			console.error(`Unable to issue find command, ${e}`);
			return { restaurantsList: [], totalNumRestaurants: 0 };
		}

		const displayCursor = cursor
			.limit(restaurantsPerPage)
			.skip(restaurantsPerPage * page);

		try {
			const restaurantsList = await displayCursor.toArray();
			const totalNumRestaurants = await restaurants.countDocuments(query);

			return { restaurantsList, totalNumRestaurants };
		} catch (e) {
			console.error(
				`Unable to convert cursor to array or problem counting documents, ${e}`
			);
			return { restaurantsList: [], totalNumRestaurants: 0 };
		}
	}

	static async updateRestaurant(data) {
		try {
			const updateResponse = await restaurants.updateOne(
				{ _id: ObjectId(data._id) },
				{
					$set: {
						name: data.name,
						restaurant_id: data.rest_id,
						"address.building": data.building,
						"address.street": data.street,
						"address.zipcode": data.zipcode,
						borough: data.borough,
					},
				}
			);

			return updateResponse;
		} catch (e) {
			console.error(`Unable to update restaurant: ${e}`);
			return { error: e };
		}
	}

	static async addRestaurant(data) {
		try {
			const restData = {
				_id: data._id,
				address: {
					building: data.building,
					street: data.street,
					zipcode: data.zipcode,
				},
				borough: data.borough,
				cuisine: data.cuisine,
				name: data.name,
				restaurant_id: data.restaurant_id,
			};

			return await restaurants.insertOne(restData);
		} catch (e) {
			console.error(`Unable to post review: ${e}`);
			return { error: e };
		}
	}

	static async deleteRestaurant(restId) {
		try {
			const deleteResponse = await restaurants.deleteOne({
				_id: ObjectId(restId),
			});

			return deleteResponse;
		} catch (e) {
			console.error(`Unable to delete restaurant: ${e}`);
			return { error: e };
		}
	}

	static async getRestaurantByID(id) {
		try {
			const pipeline = [
				{
					$match: {
						_id: new ObjectId(id),
					},
				},
				{
					$lookup: {
						from: "reviews",
						let: {
							id: "$_id",
						},
						pipeline: [
							{
								$match: {
									$expr: {
										$eq: ["$restaurant_id", "$$id"],
									},
								},
							},
							{
								$sort: {
									date: -1,
								},
							},
						],
						as: "reviews",
					},
				},
				{
					$addFields: {
						reviews: "$reviews",
					},
				},
			];
			return await restaurants.aggregate(pipeline).next();
		} catch (e) {
			console.error(`Something went wrong in getRestaurantByID: ${e}`);
			throw e;
		}
	}

	static async getCuisines() {
		let cuisines = [];
		try {
			cuisines = await restaurants.distinct("cuisine");
			return cuisines;
		} catch (e) {
			console.error(`Unable to get cuisines, ${e}`);
			return cuisines;
		}
	}
}
