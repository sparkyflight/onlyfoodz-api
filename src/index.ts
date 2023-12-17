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
			await data.execute(req, res, database, firebase);
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

const check = (query: any): boolean => {
	if (!query || query === "") return true; // empty
	else return false; // has content
};

app.all("/auth/signup", async (req: Request, res: Response) => {
	if (check(req.query.tag))
		return res.json({
			error: "Missing query: tag",
		});
	if (check(req.query.uid))
		return res.json({
			error: "Missing query: uid",
		});
	if (check(req.query.token))
		return res.json({
			error: "Missing query: token",
		});

	const userInfo: DecodedIdToken = await firebaseService
		.auth()
		.verifyIdToken(req.query.token as string, true);

	const dbUser = await database.Users.get({ userid: userInfo.uid });

	if (dbUser)
		return res.json({
			error: true,
			message: "[Database Error] => User already exists.",
		});
	else {
		const dwp = await database.Users.get({
			usertag: req.query.tag as string,
		});

		if (dwp)
			return res.json({
				error: true,
				message:
					"That username is already in use. Please choose a new one.",
			});
		else {
			const i = await database.Users.createUser(
				req.query.tag as string,
				userInfo.uid,
				req.query.tag as string,
				"None",
				"/logo.png"
			);

			if (i === true)
				return res.json({ error: false, message: "User Created." });
			else return res.json({ error: true, message: i });
		}
	}
});

app.all("/auth/callback", async (req: Request, res: Response) => {
	if (check(req.query.token))
		return res.json({
			error: true,
			message:
				"There was no Authentication Token specified with this request.",
		});

	const userInfo: DecodedIdToken = await firebaseService
		.auth()
		.verifyIdToken(req.query.token as string, true);

	const dbUser = await database.Users.get({ userid: userInfo.uid });

	if (dbUser) return res.json({ token: req.query.token });
	else
		return res.json({
			token: req.query.token,
			error: true,
			message: "User does not exist.",
		});
});

// Start Server
app.listen(process.env.PORT, async () => {
	logger.success("Server", `Hosting web server on port ${process.env.PORT}.`);
});
