// Packages
import express, { Express, Request, Response } from "express";
import fs from "fs";
import cookieParser from "cookie-parser";
import firebase from "firebase-admin";
import serviceAccount from "./firebaseService.js";
import path from "path";
import { adjs, nouns } from "./words.js";
import * as database from "./database/handler.js";
import * as logger from "./logger.js";
import cors from "cors";
import * as auth from "./auth.js";
import "dotenv/config";

// Initialize Firebase Admin
const firebaseService = firebase.initializeApp({
	credential: firebase.credential.cert(
		serviceAccount as firebase.ServiceAccount
	),
});

// Allowed Origins
const allowedOrigins = [
	{
		url: "https://onlyfoodz.xyz",
		name: "Onlyfoodz",
		image: "https://onlyfoodz.xyz/logo.png",
		verified: true,
		description:
			"Onlyfoodz, a social media platform that allows people to share pictures and small videos of food.",
		client_id: "onlyfoodz-0091",
	},
];

// Middleware
const app: Express = express();
app.use(cookieParser());
app.use(cors());
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
const apiEndpointsFiles = getFilesInDirectory("./dist/endpoints").filter(
	(file) => file.endsWith(".js")
);

for (const file of apiEndpointsFiles) {
	import(`../${file}`)
		.then((module) => {
			const endpoint = module.default;
			apiEndpoints.set(
				`${endpoint.name}:${endpoint.method.toLowerCase()}`,
				endpoint
			);
		})
		.catch((error) => {
			console.error(`Error importing ${file}: ${error}`);
		});
}

// API Endpoints
app.all(`/api/:category/:endpoint`, async (req: Request, res: Response) => {
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
app.all("/auth/login", async (req: Request, res: Response) => {
	if (!allowedOrigins.find((e) => e.client_id === req.query.client_id))
		return res.status(403).json({
			error: `\`${req.query.client_id}\` is an invalid client id`,
		});

	// Check request to see if there is a "method" query.
	const method = req.query.method as string;

	if (method || method != "") {
		const client_id = req.query.client_id as string;

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

app.all("/auth/email/callback", async (req: Request, res: Response) => {
	let response = null;

	const client_id = req.query.client_id as string;
	const token = req.query.token as string;
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
			await database.Users.create(
				adjs[Math.floor(Math.random() * (adjs.length - 1))] +
					"_" +
					nouns[Math.floor(Math.random() * (nouns.length - 1))],
				userInfo.uid,
				adjs[Math.floor(Math.random() * (adjs.length - 1))] +
					"_" +
					nouns[Math.floor(Math.random() * (nouns.length - 1))],
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

app.all("/auth/discord/callback", async (req: Request, res: Response) => {
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
			const data = JSON.parse(req.query.state as string);
			const domain = new URL(data.redirect);

			return res.redirect(`https://${domain.hostname}/`);
		}
	}

	const discord = await auth.discord.getAccessToken(req.query.code as string);
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
			userInfo.username +
				"_" +
				adjs[Math.floor(Math.random() * (adjs.length - 1))] +
				"_" +
				nouns[Math.floor(Math.random() * (nouns.length - 1))],
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

	const extraData = JSON.parse(req.query.state as string);

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
