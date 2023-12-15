// Packages
import express, { Express, Request, Response } from "express";
import fs from "fs";
import cookieParser from "cookie-parser";
import firebase from "firebase-admin";
import serviceAccount from "./firebaseService.js";
import path from "path";
import * as database from "./database/handler.js";
import * as logger from "./logger.js";
import cors from "cors";
import "dotenv/config";
import { DecodedIdToken } from "firebase-admin/auth";

// Initialize Firebase Admin
const firebaseService = firebase.initializeApp({
	credential: firebase.credential.cert(
		serviceAccount as firebase.ServiceAccount
	),
});

// Middleware
const app: Express = express();
app.use(cookieParser());
app.use(cors());
app.use(express.json());

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

app.all("/auth/callback", async (req: Request, res: Response) => {
	let response;

	if (!req.query.token || req.query.token === "")
		return res.status(400).json({
			message:
				"There was no Authentication Token specified with this request.",
		});

	const userInfo: DecodedIdToken = await firebaseService
		.auth()
		.verifyIdToken(req.query.token as string, true);

	const dbUser = await database.Users.get({ UserID: userInfo.uid });
	const token = crypto.randomUUID();

	if (dbUser) {
		await database.Tokens.createToken(
			userInfo.uid,
			token,
			userInfo.firebase.sign_in_provider.replace(".com", "")
		);

		response = token;
	} else {
		response = { error: "User does not exist." };
	}
});

// Start Server
app.listen(process.env.PORT, async () => {
	logger.success("Server", `Hosting web server on port ${process.env.PORT}.`);
});
