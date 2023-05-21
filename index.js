// Packages
const express = require("express");
const app = express();
const logger = require("./logger");
const fs = require("node:fs");
const cookieParser = require("cookie-parser");
const SpotifyWebApi = require("spotify-web-api-node");
const database = require("./database/handler");
const auth = require("./auth");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const crypto = require("node:crypto");
const firebase = require("firebase-admin");
require("dotenv").config();

// Initalize Spotify
const Spotify = new SpotifyWebApi({
	clientId: process.env.SPOTIFY_CLIENT_ID,
	clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
	redirectUri: "https://api.nightmarebot.tk/spotify/callback",
});

// Initalize Spotify (for Users)
const SpotifyUsers = new SpotifyWebApi({
	clientId: process.env.SPOTIFY_CLIENT_ID,
	clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
	redirectUri: "https://api.nightmarebot.tk/auth/spotify/callback",
});

// Initialize Firebase Admin
firebase.initalizeApp({
  credential: firebase.credential.cert(require("./firebaseService.json"))
});

// Set scopes for Spotify (all) oAuth
const scopes = [
	"user-read-private",
	"user-read-currently-playing",
	"user-read-recently-played",
	"user-modify-playback-state",
	"user-read-playback-state",
	"user-top-read",
	"streaming",
	"user-read-private",
	"user-read-email",
];

const state = "d194dbc0-6745-4937-b99e-54615bca25bd";

// Middleware
app.use(cookieParser());
app.use(require("cors")());
app.use(express.json());
app.set("view engine", "ejs");

// API Endpoints Map
const apiEndpoints = new Map();
const apiEndpointsFiles = fs
	.readdirSync("./endpoints")
	.filter((file) => file.endsWith(".js"));

for (const file of apiEndpointsFiles) {
	const endpoint = require(`./endpoints/${file}`);
	apiEndpoints.set(
		`${endpoint.name}:${endpoint.method.toLowerCase()}`,
		endpoint
	);
}

// API Endpoints
app.all(`/api/:category/:endpoint`, async (req, res) => {
	const endpoint = `${req.params.category}/${
		req.params.endpoint
	}:${req.method.toLowerCase()}`;
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

// Authentication Endpoints
app.all("/auth/login", async (req, res) => {
	// Check if origin is allowed.
	const allowedOrigins = [
		{
			url: "https://nightmarebot.tk",
			name: "Azidoazide",
			image: "https://nightmarebot.tk/logo.png",
			verified: true,
			description:
				"Nightmare Bot is a personal assistant project that uses Artificial Intelligence and Machine Learning algorithms to solve problems.",
			client_id: "website-0297",
		},
		{
			url: "https://onlyfoodz.xyz",
			name: "Onlyfoodz",
			image: "https://onlyfoodz.xyz/logo.png",
			verified: true,
			description:
				"Onlyfoodz is a social media platform by Azidoazide that allows people to share pictures and small videos of food.",
			client_id: "onlyfoodz-0091",
		},
		{
			url: "https://nightmarebot.tk/onlyfoodz",
			name: "Onlyfoodz (Discord)",
			image: "https://onlyfoodz.xyz/logo.png",
			verified: true,
			description:
				"Onlyfoodz is a social media platform by Azidoazide that allows people to share pictures and small videos of food.",
			client_id: "onlyfoodzdc-7798321",
		},
		{
			url: "https://dj.azidoazide.xyz",
			name: "AzidoDJ",
			image: "https://dj.azidoazide.xyz/logo.png",
			verified: true,
			description:
				"AzidoDJ is a Artificial Intelligence based DJ experience that allows you to always be in the moment, with similar music you already listen to!",
			client_id: "azidodj-2294753900445",
		},
	];

	if (!allowedOrigins.find((e) => e.client_id === req.query.client_id))
		return res.status(403).json({
			error: `\`${req.query.client_id}\` is a invalid client id`,
		});

	// Check request to see if there is a "method" query.
	const method = req.query.method;

	if (method || method != "") {
		const client_id = req.query.client_id;

		if (method === "discord") {
			const url = await auth.discord.getAuthURL(
				`${
					allowedOrigins.find((e) => e.client_id === client_id).url
				}/auth/callback`
			);

			return res.redirect(url);
		}

		if (method === "spotify") {
			const client = JSON.stringify({
				redirect: `${
					allowedOrigins.find((e) => e.client_id === client_id).url
				}/auth/callback`,
				uuid: crypto.randomUUID(),
			});

			const url = SpotifyUsers.createAuthorizeURL(scopes, client);
			res.redirect(url);
		}
	}

	return res.render("pages/login", {
		page: req.query.page,
		websiteData: allowedOrigins.find(
			(e) => e.client_id === req.query.client_id
		),
	});
});

app.all("/auth/discord/callback", async (req, res) => {
	let response = null;

	if (!req.query.code || req.query.code === "") {
		if (!req.query.state || req.query.state === "")
			return res.status(400).json({
				message:
					"There was no code, and state provided with this request.",
				error: true,
				status: 400,
			});
		else {
			const data = JSON.parse(req.query.state);
			const domain = new URL(data.redirect);

			return res.redirect(`https://${domain.hostname}/`);
		}
	}

	const discord = await auth.discord.getAccessToken(req.query.code, true);
	const userInfo = await auth.discord.getUserInfo(discord.access_token);
	const dbUser = await database.Users.get({ UserID: userInfo.id });

	if (dbUser) {
		const token = crypto.randomUUID();
		await database.Tokens.create(userInfo.id, token, "Discord");

		response = token;
	} else {
		await database.Users.create(
			userInfo.username,
			userInfo.id,
			null,
			`https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}`,
			new Date(),
			[
				{
					service: "Discord",
					id: userInfo.id,
					accessToken: null,
					refreshToken: null,
				},
			]
		);

		const token = crypto.randomUUID();
		await database.Tokens.create(userInfo.id, token, "Discord");

		response = token;
	}

	const extraData = JSON.parse(req.query.state);

	let url = extraData.redirect;
	url += "?token=" + encodeURIComponent(response);

	setTimeout(() => {
		res.redirect(url);
	}, 1000);
});

app.all("/auth/spotify/callback", async (req, res) => {
	let response = null;

	if (!req.query.code || req.query.code === "") {
		if (!req.query.state || req.query.state === "")
			return res.status(400).json({
				message:
					"There was no code, and state provided with this request.",
				error: true,
				status: 400,
			});
		else {
			const data = JSON.parse(req.query.state);
			const domain = new URL(data.redirect);

			return res.redirect(`https://${domain.hostname}/`);
		}
	}

	const spotifyToken = await SpotifyUsers.authorizationCodeGrant(
		req.query.code
	);
	SpotifyUsers.setAccessToken(spotifyToken.body["access_token"]);
	SpotifyUsers.setRefreshToken(spotifyToken.body["refresh_token"]);

	const user = await SpotifyUsers.getMe();
	const userInfo = user["body"];
	const dbUser = await database.Users.get({ UserID: userInfo.id });

	if (dbUser) {
		const token = crypto.randomUUID();
		await database.Tokens.create(userInfo.id, token, "Spotify");

		const connections = dbUser.Connections;

		if (connections.find((e) => e.service === "Spotify")) {
			connections[
				connections.findIndex((e) => e.service === "Spotify")
			].accessToken = SpotifyUsers.getAccessToken();

			connections[
				connections.findIndex((e) => e.service === "Spotify")
			].refreshToken = SpotifyUsers.getRefreshToken();
		}

		await database.Users.update(userInfo.id, {
			Connections: connections,
		});

		response = token;
	} else {
		await database.Users.create(
			userInfo.display_name.replaceAll(" ", ""),
			userInfo.id,
			null,
			userInfo.images[0].url,
			new Date(),
			[
				{
					service: "Spotify",
					id: userInfo.id,
					accessToken: SpotifyUsers.getAccessToken(),
					refreshToken: SpotifyUsers.getRefreshToken(),
				},
			]
		);

		const token = crypto.randomUUID();
		await database.Tokens.create(userInfo.id, token, "Discord");

		response = token;
	}

	SpotifyUsers.resetAccessToken();
	SpotifyUsers.resetRefreshToken();

	const extraData = JSON.parse(req.query.state);

	let url = extraData.redirect;
	url += "?token=" + encodeURIComponent(response);

	setTimeout(() => {
		res.redirect(url);
	}, 1000);
});

// Spotify Authentication Endpoints
app.get("/spotify", async (req, res) => {
	const url = Spotify.createAuthorizeURL(scopes, state);
	res.redirect(url);
});

app.get("/spotify/callback", async (req, res) => {
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

				res.redirect("https://nightmarebot.tk/");
			},
			(err) => {
				res.json({
					error: err,
				});
			}
		);
	}
});

// Socket Events
io.on("connection", (socket) => {
	logger.debug("WS", "A new connection has been initalized.");

	setTimeout(() => {
		socket.emit(
			"tts_say",
			"Hello there! Welcome to your personalized DJ experience. My name is DJ Azido, and i am glad to serve you the best music!"
		);
	}, 3000);
});

// Start Server
server.listen(process.env.PORT, async () => {
	logger.success("Server", `Hosting web server on port ${process.env.PORT}.`);
});
