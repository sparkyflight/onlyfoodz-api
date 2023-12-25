import { FastifyReply, FastifyRequest } from "fastify";
import { OnlyfoodzPost } from "../../database/types.interface.js";
import * as database from "../../database/handler.js";

export default {
	url: "/posts/get",
	method: "GET",
	schema: {
		querystring: {
			type: "object",
			properties: {
				post_id: { type: "string" },
			},
			required: ["post_id"],
		},
	},
	handler: async (request: FastifyRequest, reply: FastifyReply) => {
		const { post_id }: any = request.query;

		if (post_id || post_id != "") {
			const post: OnlyfoodzPost =
				await database.OnlyfoodzPosts.get(post_id);
			return reply.send(post);
		} else
			return reply.status(404).send({
				error: "You did not provide a valid Post ID.",
			});
	},
};
