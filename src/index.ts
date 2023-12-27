// Packages
import fs from "node:fs";
import firebase from "firebase-admin";
import serviceAccount from "./firebaseService.js";
import path from "path";
import * as database from "./database/handler.js";
import * as auth from "./auth.js";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import ui from "@fastify/swagger-ui";
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

app.register(cors, {
	origin: true,
});

app.register(swagger, {
	swagger: {
		info: {
			title: "Sparkyflight",
			description:
				"Welcome to Sparkyflight, the future of Social Media designed for the neurodiverse community, with a primary focus on individuals on the Autism Spectrum. Sparkyflight aims to provide a safe and inclusive space for people to connect, learn, and communicate about their special interests. Our platform utilizes a machine learning algorithm to match users based on their unique passions, creating a supportive network for shared education.",
			version: "2.0.0",
		},
		externalDocs: {
			url: "https://docs.sparkyflight.xyz",
			description:
				"You can possibly find more information about our infrastructure/api here.",
		},
		host:
			process.env.ENV === "production"
				? "api.onlyfoodz.xyz"
				: "localhost",
		schemes: ["http"],
		consumes: ["application/json"],
		produces: ["application/json"],
	},
});

app.register(ui, {
	routePrefix: "/docs",
	uiConfig: {
		docExpansion: "full",
		deepLinking: false,
	},
	uiHooks: {
		onRequest: (request, reply, next) => {
			next();
		},
		preHandler: (request, reply, next) => {
			next();
		},
	},
	staticCSP: true,
	transformStaticCSP: (header) => header,
	transformSpecification: (swaggerObject, request, reply) => {
		return swaggerObject;
	},
	transformSpecificationClone: true,
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
