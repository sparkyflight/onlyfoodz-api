import { User, OnlyfoodzPost } from "../../database/types.interface.js";
import { FastifyReply, FastifyRequest } from "fastify";
import * as database from "../../database/handler.js";
import { getAuth } from "../../auth.js";

export default {
	url: "/posts/comment",
	method: "POST",
	schema: {
		querystring: {
			type: "object",
			properties: {
				id: { type: "string" },
			},
			required: ["id"],
		},
		body: {
			type: "object",
			properties: {
				caption: { type: "string" },
				image: { type: "string" },
			},
			required: ["caption"],
		},
		security: [
			{
				apiKey: [],
			},
		],
	},
	handler: async (request: FastifyRequest, reply: FastifyReply) => {
		const data = request.body;
		const { id }: any = request.query;
		const Authorization: any = request.headers.authorization;

		const user: User | null = await getAuth(Authorization);
		const post: OnlyfoodzPost = await database.OnlyfoodzPosts.get(id);

		if (user) {
			if (post) {
				const update = await database.OnlyfoodzPosts.comment(
					post,
					user,
					data["caption"],
					data["image"]
				);

				if (update) return reply.send({ success: true });
				else
					return reply.send({
						error: "Something went wrong with processing your request.",
					});
			} else
				return reply.send({
					error: "The provided post id is invalid.",
				});
		} else
			return reply.send({
				error: "The provided user token is invalid, or the user does not exist.",
			});
	},
};
