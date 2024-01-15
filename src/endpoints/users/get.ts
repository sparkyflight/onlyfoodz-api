import { FastifyReply, FastifyRequest } from "fastify";
import * as database from "../../v2-database/prisma.js";

export default {
	url: "/users/get",
	method: "GET",
	schema: {
		summary: "Get user",
		description: "Gets a user.",
		tags: ["users"],
		querystring: {
			type: "object",
			properties: {
				tag: { type: "string" },
			},
			required: ["tag"],
		},
	},
	handler: async (request: FastifyRequest, reply: FastifyReply) => {
		const data: any = request.query;

		const tag = data.tag;
		let user = await database.Users.get({ usertag: tag });

		if (user) return reply.send(user);
		else
			return reply.status(404).send({
				message:
					"We couldn't fetch any information about this user in our database",
				error: true,
			});
	},
};
