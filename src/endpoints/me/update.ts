import { DecodedIdToken } from "firebase-admin/auth";
import { User } from "../../database/types.interface.js";
import { FastifyReply, FastifyRequest } from "fastify";
import firebase from "firebase-admin";
import * as database from "../../database/handler.js";

export default {
	url: "/users/@me",
	method: "PATCH",
	schema: {
		body: {
			type: "object",
			properties: {
				name: { type: "string" },
				avatar: { type: "string" },
				bio: { type: "string" },
				token: { type: "string" },
			},
			required: ["name", "avatar", "token"],
		},
	},
	handler: async (request: FastifyRequest, reply: FastifyReply) => {
		let data = request.body;

		const token: DecodedIdToken = await firebase
			.auth()
			.verifyIdToken(data["token"], true);
		const user: User = await database.Users.get({ userid: token.uid });

		if (user) {
			if (!data["bio"] || data["bio"] === "") data["bio"] = null;

			await database.Users.updateUser(user.userid, {
				name: data["name"],
				avatar: data["avatar"],
				bio: data["bio"] || null,
			});

			return reply.send({
				success: true,
			});
		} else
			reply.status(404).send({
				message:
					"We couldn't fetch any information about you in our database",
				token: data["token"],
				error: true,
			});
	},
};
