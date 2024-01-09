import { User, OnlyfoodzPost, Post } from "../../database/types.interface.js";
import { FastifyReply, FastifyRequest } from "fastify";
import * as database from "../../database/handler.js";

export default {
	url: "/user/list_posts",
	method: "GET",
	schema: {
		summary: "Get user posts",
		description: "Gets a user's posts.",
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
		let onlyfoodz: OnlyfoodzPost[] | null;
		let posts: Post[] | null;

		if (tag || tag != "") {
			let user: User = await database.Users.get({ usertag: tag });

			if (user) {
				onlyfoodz = await database.OnlyfoodzPosts.getAllUserPosts(
					user.userid
				);
				onlyfoodz.reverse();

				posts = await database.Posts.getAllUserPosts(user.userid);
				posts.reverse();

				return reply.send({
					onlyfoodz,
					posts,
				});
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
