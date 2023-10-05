// Packages
const express = require("express"),
	app = express();
const logger = require("./logger");
const fs = require("node:fs");
const cookieParser = require("cookie-parser");
const database = require("./database/handler");
const auth = require("./auth");
const crypto = require("node:crypto");
const firebase = require("firebase-admin");
const path = require("path");
require("dotenv").config();

// Initialize Firebase Admin
const firebaseService = firebase.initializeApp({
	credential: firebase.credential.cert(require("./firebaseService.json")),
});

// Allowed Origins
const allowedOrigins = [
	{
		url: "https://azidoazide.xyz",
		name: "Azidoazide",
		image: "https://azidoazide.xyz/logo.png",
		verified: true,
		description:
			"Azidoazide is a personal assistant project that uses Artificial Intelligence and Machine Learning algorithms to solve problems.",
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
];

// Middleware
app.use(cookieParser());
app.use(require("cors")());
app.use(express.json());
app.set("view engine", "ejs");

// API Endpoints Map
const getFilesInDirectory = (dir) => {
	let files = [];
	const filesInDir = fs.readdirSync(dir);

	for (const file of filesInDir) {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);

		if (stat.isDirectory())
			files = files.concat(getFilesInDirectory(filePath));
		else files.push(filePath);
	}

	return files;
};

const apiEndpoints = new Map();
const apiEndpointsFiles = getFilesInDirectory("./endpoints").filter((file) =>
	file.endsWith(".js")
);

for (const file of apiEndpointsFiles) {
	const endpoint = require(`./${file}`);
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
			await data.execute(req, res, database);
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
	}

	return res.render("pages/login", {
		page: req.query.page,
		websiteData: allowedOrigins.find(
			(e) => e.client_id === req.query.client_id
		),
	});
});

app.all("/auth/email/callback", async (req, res) => {
	let response = null;

	const client_id = req.query.client_id;
	const token = req.query.token;
	const websiteData = allowedOrigins.find((e) => e.client_id === client_id);

	if (!client_id || client_id === "")
		return res.status(400).json({
			message: "There was no Client ID specified with this request.",
			error: true,
			status: 400,
		});
	if (!token || token === "")
		return res.status(400).json({
			message:
				"There was no Authentication Token specified with this request.",
		});

	if (!websiteData)
		return res.status(400).json({
			message: "The provided Client ID is invalid.",
			error: true,
			status: 400,
		});
	else {
		const userInfo = await firebaseService
			.auth()
			.verifyIdToken(token, true);

		const dbUser = await database.Users.get({ UserID: userInfo.uid });

		if (dbUser) {
			const token = crypto.randomUUID();
			await database.Tokens.create(userInfo.uid, token, "Email");

			response = token;
		} else {
			const adjs = [
					"autumn",
					"hidden",
					"bitter",
					"misty",
					"silent",
					"empty",
					"dry",
					"dark",
					"summer",
					"icy",
					"delicate",
					"quiet",
					"white",
					"cool",
					"spring",
					"winter",
					"patient",
					"twilight",
					"dawn",
					"crimson",
					"wispy",
					"weathered",
					"blue",
					"billowing",
					"broken",
					"cold",
					"damp",
					"falling",
					"frosty",
					"green",
					"long",
					"late",
					"lingering",
					"bold",
					"little",
					"morning",
					"muddy",
					"old",
					"red",
					"rough",
					"still",
					"small",
					"sparkling",
					"throbbing",
					"shy",
					"wandering",
					"withered",
					"wild",
					"black",
					"young",
					"holy",
					"solitary",
					"fragrant",
					"aged",
					"snowy",
					"proud",
					"floral",
					"restless",
					"divine",
					"polished",
					"ancient",
					"purple",
					"lively",
					"nameless",
				],
				nouns = [
					"waterfall",
					"river",
					"breeze",
					"moon",
					"rain",
					"wind",
					"sea",
					"morning",
					"snow",
					"lake",
					"sunset",
					"pine",
					"shadow",
					"leaf",
					"dawn",
					"glitter",
					"forest",
					"hill",
					"cloud",
					"meadow",
					"sun",
					"glade",
					"bird",
					"brook",
					"butterfly",
					"bush",
					"dew",
					"dust",
					"field",
					"fire",
					"flower",
					"firefly",
					"feather",
					"grass",
					"haze",
					"mountain",
					"night",
					"pond",
					"darkness",
					"snowflake",
					"silence",
					"sound",
					"sky",
					"shape",
					"surf",
					"thunder",
					"violet",
					"water",
					"wildflower",
					"wave",
					"water",
					"resonance",
					"sun",
					"wood",
					"dream",
					"cherry",
					"tree",
					"fog",
					"frost",
					"voice",
					"paper",
					"frog",
					"smoke",
					"star",
				];

			await database.Users.create(
				adjs[Math.floor(Math.random() * (adjs.length - 1))] +
					"_" +
					nouns[Math.floor(Math.random() * (nouns.length - 1))],
				userInfo.uid,
				null,
				"",
				new Date(),
				[
					{
						service: "Email",
						id: userInfo.uid,
						accessToken: null,
						refreshToken: null,
					},
				]
			);

			const token = crypto.randomUUID();
			await database.Tokens.create(userInfo.uid, token, "Email");

			response = token;
		}

		let url = `${websiteData.url}/auth/callback`;
		url += "?token=" + encodeURIComponent(response);

		setTimeout(() => {
			res.redirect(url);
		}, 1000);
	}
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

// Start Server
app.listen(process.env.PORT, async () => {
	logger.success("Server", `Hosting web server on port ${process.env.PORT}.`);
});
