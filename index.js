// Packages
const app = require("express")();
const logger = require("./logger");
const fs = require("node:fs");
const cookieParser = require("cookie-parser");
const SpotifyWebApi = require("spotify-web-api-node");
const database = require("./database/handler");
require("dotenv").config();

// Initalize Spotify
const spotifyCredientials = {
	clientId: process.env.SPOTIFY_CLIENT_ID,
	clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
	redirectUri: process.env.SPOTIFY_REDIRECT_URI,
};

const Spotify = new SpotifyWebApi(spotifyCredientials);

const scopes = [
	"user-read-private",
	"user-read-currently-playing",
	"user-read-recently-played",
];

const state = "d194dbc0-6745-4937-b99e-54615bca25bd";

// Middleware
app.use(cookieParser());

// Spotify Authentication Endpoints
app.get("/auth/spotify", async (req, res) => {
	const url = Spotify.createAuthorizeURL(scopes, state);
	res.redirect(url);
});

app.get("/auth/spotify/callback", async (req, res) => {
	const code = req.query.code;

	if (!code || code === "")
		return res.json({
			err: "No authentication token was returned with request.",
		});
	else {
		Spotify.authorizationCodeGrant(code).then(
			(data) => {
				Spotify.setAccessToken(data.body["access_token"]);
				Spotify.setRefreshToken(data.body["refresh_token"]);

				res.redirect("/");
			},
			(err) => {
				res.json({
					error: err,
				});
			}
		);
	}
});

// Start Server
app.listen(5590, () => {
	logger.success("Express", "Hosting web server on port 5590.");
});
