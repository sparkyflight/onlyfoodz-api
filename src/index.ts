// Packages
import fs from "fs";
import firebase from "firebase-admin";
import serviceAccount from "./firebaseService.js";
import path from "path";
import * as database from "./database/handler.js";
import "dotenv/config";
import Fastify, { FastifyInstance, RouteOptions } from "fastify";

// Initialize Firebase Admin
firebase.initializeApp({
	credential: firebase.credential.cert(
		serviceAccount as firebase.ServiceAccount
	),
});

// Middleware
const app: FastifyInstance = Fastify({
	logger: true,
});

app.setErrorHandler(async (error: any, reply: any) => {
	console.log(error.stack);

	if (error.validation)
		return reply.code(400).send({
			statusCode: 400,
			error: "Bad Request",
			message: error.message,
		});
	else
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
let Routes: RouteOptions[] = [];

const apiEndpointsFiles = getFilesInDirectory("./dist/endpoints").filter(
	(file) => file.endsWith(".js")
);

for (const file of apiEndpointsFiles) {
	import(`../${file}`)
		.then((module) => {
			Routes.push(module.default);
			app.route(module.default);
		})
		.catch((error) => {
			console.error(`Error importing ${file}: ${error}`);
		});
}

setTimeout(() => {
	// Start Server
	app.listen({ port: Number(process.env.PORT) }, (err) => {
		if (err) throw err;
	});
}, 4000);
