// Packages
import fs from "fs";
import firebase from "firebase-admin";
import serviceAccount from "./firebaseService.js";
import path from "path";
import * as database from "./database/handler.js";
import * as logger from "./logger.js";
import "dotenv/config";
import Fastify, { FastifyInstance, RouteOptions } from "fastify";

// Initialize Firebase Admin
const firebaseService = firebase.initializeApp({
	credential: firebase.credential.cert(
		serviceAccount as firebase.ServiceAccount
	),
});

// Middleware
const app: FastifyInstance = Fastify({
	logger: true,
});

app.setErrorHandler(async (error: any, reply: any) => {
	await console.log(error.stack);

	if (error.validation) {
		return reply.code(400).send({
			statusCode: 400,
			error: "Bad Request",
			message: error.message,
		});
	}

	return reply.code(500).send({
		statusCode: 500,
		error: "Internal Server Error",
		message: error.message,
	});
});

// API Endpoints Map
const getFilesInDirectory = (dir: string) => {
	let files: string[] = [];
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

// API Endpoints
let Routes: RouteOptions[] = [
	{
		method: ["GET", "POST", "PATCH", "HEAD", "OPTIONS", "DELETE"],
		url: "/auth/signup",
		schema: {
			querystring: {
				type: "object",
				properties: {
					tag: { type: "string" },
					uid: { type: "string" },
					token: { type: "string" },
				},
				required: ["tag", "uid", "token"],
			},
		},
		handler: async (request, reply) => {
			try {
				const { token, tag }: any = request.params;

				const userInfo = await firebaseService
					.auth()
					.verifyIdToken(token, true);
				const dbUser = await database.Users.get({
					userid: userInfo.uid,
				});

				if (dbUser) {
					return reply.send({
						error: true,
						message: "[Database Error] => User already exists.",
					});
				} else {
					const existingUser = await database.Users.get({
						usertag: tag,
					});
					if (existingUser) {
						return reply.send({
							error: true,
							message:
								"That username is already in use. Please choose a new one.",
						});
					} else {
						const result = await database.Users.createUser(
							tag,
							userInfo.uid,
							tag,
							"None",
							"/logo.png"
						);

						if (result === true)
							return reply.send({
								error: false,
								message: "User Created.",
							});
						else
							return reply.send({ error: true, message: result });
					}
				}
			} catch (error) {
				reply.status(500).send({
					error: "Internal Server Error",
					message: "An error occurred while processing your request.",
				});

				logger.error("Error during user signup", error);
			}
		},
	},
	{
		method: ["GET", "POST", "PATCH", "HEAD", "OPTIONS", "DELETE"],
		url: "/auth/callback",
		schema: {
			querystring: {
				type: "object",
				properties: {
					token: { type: "string" },
				},
				required: ["token"],
			},
		},
		handler: async (request, reply) => {
			try {
				const { token }: any = request.params;

				const userInfo = await firebaseService
					.auth()
					.verifyIdToken(token, true);
				const dbUser = await database.Users.get({
					userid: userInfo.uid,
				});

				if (dbUser) return reply.send({ token: token });
				else
					return reply.send({
						token: token,
						error: true,
						message: "User does not exist.",
					});
			} catch (error) {
				reply.status(500).send({
					error: "Internal Server Error",
					message: "An error occurred while processing your request.",
				});

				logger.error("Error during authentication callback", error);
			}
		},
	},
];

const apiEndpointsFiles = getFilesInDirectory("./dist/endpoints").filter(
	(file) => file.endsWith(".js")
);

for (const file of apiEndpointsFiles) {
	import(`../${file}`)
		.then((module) => {
			const endpoint = module.default;
			if (endpoint.handler) Routes.push(endpoint);
		})
		.catch((error) => {
			console.error(`Error importing ${file}: ${error}`);
		});
}

setTimeout(() => {
	if (Routes.length === apiEndpointsFiles.length + 2) {
		Routes.forEach((route) => app.route(route));

		// Start Server
		app.listen({ port: Number(process.env.PORT) }, (err) => {
			if (err) throw err;
		});
	}
}, 4000);
