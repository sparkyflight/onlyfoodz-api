import * as database from "../../Serendipy/prisma.js";
import firebase from "firebase-admin";
import { FastifyReply, FastifyRequest } from "fastify";
import { Novu, PushProviderIdEnum } from "@novu/node";

const novu = new Novu(process.env.NOVU_API_KEY);

export default {
	method: "PATCH",
	url: "/users/fcm",
	schema: {
		summary: "Push FCM Key to an User",
		description:
			"Push a Firebase Cloud Messaging key to a user. Returns boolean value indicating whether the creation was successful or not.",
		tags: ["@me"],
		body: {
			type: "object",
			properties: {
				name: { type: "string" },
				key: { type: "string" },
			},
			required: ["name", "key"],
		},
		security: [
			{
				apiKey: [],
			},
		],
	},
	handler: async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const { name, key }: any = request.body;
			const Authorization: any = request.headers.authorization;

			const userInfo = await firebase
				.auth()
				.verifyIdToken(Authorization, true);
			const dbUser = await database.Users.get({
				userid: userInfo.uid,
			});

			if (dbUser) {
				await database.prisma.fcm_keys.create({
					data: {
						userid: dbUser.userid,
						name: name,
						key: key,
					},
				});

				await novu.subscribers.setCredentials(
					dbUser.userid,
					PushProviderIdEnum.FCM,
					{
						deviceTokens: [key],
					}
				);

				return reply.send({
					success: true,
				});
			} else
				return reply.send({
					token: Authorization,
					error: true,
					message: "User does not exist.",
				});
		} catch (error) {
			reply.status(500).send({
				error: "Internal Server Error",
				message: error.errorInfo.message,
			});
		}
	},
};
