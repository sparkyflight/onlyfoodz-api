import { User } from "../../database/types.interface.js";
import { FastifyReply, FastifyRequest } from "fastify";
import * as database from "../../database/handler.js";
import { getAuth } from "../../auth.js";

export default {
	url: "/posts/post",
	method: "POST",
	schema: {
		body: {
			type: "object",
			properties: {
				caption: { type: "string" },
				image: { type: "string" },
				plugins: { type: "array" },
				user: {
					type: "object",
					properties: {
						user_token: { type: "string" },
					},
					required: ["user_token"],
				},
			},
			required: ["caption"],
		},
	},
	handler: async (request: FastifyRequest, reply: FastifyReply) => {
		const data = request.body;

		if (!data["user"]["user_token"])
			return reply.status(401).send({
				error: "Oops, it seems that you are not logged in.",
			});
		else {
			const user: User | null = await getAuth(data["user"]["user_token"]);

			if (user) {
				await database.OnlyfoodzPosts.createPost(
					user.userid,
					data["caption"],
					data["image"],
					data["plugins"],
					1
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
