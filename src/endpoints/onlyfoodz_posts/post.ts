import { User } from "../../database/types.interface.js";
import { FastifyReply, FastifyRequest } from "fastify";
import * as database from "../../database/handler.js";
import { getAuth } from "../../auth.js";

export default {
	url: "/onlyfoodz/posts/post",
	method: "POST",
	schema: {
		summary: "Create post",
		description: "Creates a post.",
		tags: ["posts"],
		body: {
			type: "object",
			properties: {
				caption: { type: "string" },
				image: { type: "string" },
				plugins: { type: "array" },
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
		const Authorization: any = request.headers.authorization;

		if (!Authorization)
			return reply.status(401).send({
				error: "Oops, it seems that you are not logged in.",
			});
		else {
			const user: User | null = await getAuth(
				Authorization,
				"posts.write"
			);

			if (user) {
				await database.OnlyfoodzPosts.createPost(
					user.userid,
					data["caption"],
					data["image"],
					data["plugins"]
				);

				return reply.send({ success: true });
			} else {
				return reply.send({
					success: false,
					error: "The user does not exist.",
				});
			}
		}
	},
};
