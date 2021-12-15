import express from "express";
import RestaurantsCtrl from "../controllers/restaurants.controller.js";
import ReviewsCtrl from "../controllers/reviews.controller.js";

const router = express.Router();

router.route("/").get(RestaurantsCtrl.GetRestaurants);
router.route("/form").get(RestaurantsCtrl.AddRestaurant);
router.route("/:id").get(RestaurantsCtrl.GetRestaurantById);
router.route("/delete").delete(RestaurantsCtrl.DeleteRestaurantById);
router.route("/update").put(RestaurantsCtrl.UpdateRestaurant);
router.route("/post").post(RestaurantsCtrl.PostRestaurant);

export default router;
