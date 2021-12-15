import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
import RestaurantsModels from "./models/restaurantsModels.js";
import ReviewsModels from "./models/reviewsModels.js";
dotenv.config();
const MongoClient = mongodb.MongoClient;

const port = process.env.PORT || 8000;

MongoClient.connect(process.env.RESTREVIEWS_DB_URI, {
	// poolSize: 50,
	// WriteConcern: { wtimeout: 2500 },
	// useNewUrlParse: true,
	useUnifiedTopology: true,
})
	.catch((err) => {
		console.error(err.stack);
		process.exit(1);
	})
	.then(async (client) => {
		await RestaurantsModels.injectDB(client);
		await ReviewsModels.injectDB(client);
		app.listen(port, () => {
			console.log(`listening on port ${port}`);
		});
	});
