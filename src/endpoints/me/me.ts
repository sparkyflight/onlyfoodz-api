import { User } from "../../database/types.interface.js";
import { FastifyReply, FastifyRequest } from "fastify";
import { getAuth } from "../../auth.js";

export default {
	method: "GET",
	url: "/users/@me",
	schema: {
		querystring: {
			type: "object",
			properties: {
				token: { type: "string" },
			},
			required: ["token"],
		},
	},
	handler: async (request: FastifyRequest, reply: FastifyReply) => {
		const { token }: any = request.query;
		const user: User | null = await getAuth(token);

		if (user) return reply.send(user);
		else
			return reply.status(404).send({
				message:
					"We couldn't fetch any information about you in our database",
				token: token,
				error: true,
			});
	},
};
