import { FastifyReply, FastifyRequest } from "fastify";
import * as database from "../../database/handler.js";
import firebase from "firebase-admin";
import * as logger from "../../logger.js";

export default {
	method: ["GET", "POST", "PATCH", "HEAD", "OPTIONS", "DELETE"],
	url: "/auth/callback",
	schema: {
		security: [
			{
				apiKey: [],
			},
		],
	},
	handler: async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const Authorization: any = request.headers.authorization;

			const userInfo = await firebase
				.auth()
				.verifyIdToken(Authorization, true);
			const dbUser = await database.Users.get({
				userid: userInfo.uid,
			});

			if (dbUser) return reply.send({ token: Authorization });
			else
				return reply.send({
					token: Authorization,
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
};
