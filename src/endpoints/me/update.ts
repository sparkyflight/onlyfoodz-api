import { User } from "../../database/types.interface.js";
import { FastifyReply, FastifyRequest } from "fastify";
import * as database from "../../database/handler.js";
import { getAuth } from "../../auth.js";

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
			},
			required: ["name", "avatar"],
		},
		security: [
			{
				apiKey: [],
			},
		],
	},
	handler: async (request: FastifyRequest, reply: FastifyReply) => {
		let data = request.body;
		const Authorization: any = request.headers.authorization;

		const user: User | null = await getAuth(Authorization, "profile.write");

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
				token: Authorization,
				error: true,
			});
	},
};
