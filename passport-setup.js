import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (user, done) {
	// User.findById(id, function (err, user) {
	done(null, user);
	// });
});

passport.use(
	new GoogleStrategy.Strategy(
		{
			clientID:
				"975481031659-2hm9l0n3234acjfdp7362id6amvq3vvo.apps.googleusercontent.com",
			clientSecret: "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",
			callbackURL: "http://localhost:5000/google/callback",
		},
		function (accessToken, refreshToken, profile, done) {
			// User.findOrCreate({ googleId: profile.id }, function (err, user) {
			return done(null, profile);
			// });
		}
	)
);
