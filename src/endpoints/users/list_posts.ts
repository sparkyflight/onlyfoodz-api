import { User, OnlyfoodzPost } from "../../database/types.interface.js";
import { FastifyReply, FastifyRequest } from "fastify";
import * as database from "../../database/handler.js";

export default {
	url: "/posts/list_user",
	method: "GET",
	schema: {
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
		let posts: OnlyfoodzPost[] | null;

		if (tag || tag != "") {
			let user: User = await database.Users.get({ usertag: tag });

			if (user) {
				posts = await database.OnlyfoodzPosts.getAllUserPosts(
					user.userid,
					String(1)
				);
				posts.reverse();

				return reply.send(posts);
			} else
				return reply.status(404).send({
					message:
						"We couldn't fetch any information about this user in our database",
					error: true,
				});
		} else
			return reply.status(404).send({
				error: "There was no user tag specified with the request.",
			});
	},
};
