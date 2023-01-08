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

// API Endpoints Map
const apiEndpoints = new Map();
const apiEndpointsFiles = fs
	.readdirSync("./endpoints")
	.filter((file) => file.endsWith(".js"));

for (const file of apiEndpointsFiles) {
	const endpoint = require(`./endpoints/${file}`);
	apiEndpoints.set(endpoint.name, endpoint);
}

// API Endpoints
app.all(`/api/:category/:endpoint`, async (req, res) => {
	const endpoint = `${req.params.category}/${req.params.endpoint}`;
	const data = apiEndpoints.get(endpoint);

	if (data) {
		if (data.method != req.method)
			return res.status(405).json({
				error: `Method "${data.method}" is not allowed for endpoint "${endpoint}"`,
			});

		try {
			await data.execute(req, res, database, Spotify);
		} catch (error) {
			res.status(500).json({
				error: "Internal Server Error",
				message: "An error occurred while processing your request.",
			});

			logger.error(`API (${endpoint})`, error);
		}
	} else
		return res.status(404).json({
			error: "This endpoint does not exist.",
		});
});

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
