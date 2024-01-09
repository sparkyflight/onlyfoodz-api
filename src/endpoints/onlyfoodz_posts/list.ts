import { OnlyfoodzPost } from "../../database/types.interface.js";
import * as database from "../../database/handler.js";
import { FastifyReply, FastifyRequest } from "fastify";

export default {
	url: "/onlyfoodz/posts/list",
	method: "GET",
	schema: {
		summary: "Get all posts",
		description: "Returns all posts.",
		tags: ["posts"],
	},
	handler: async (request: FastifyRequest, reply: FastifyReply) => {
		let posts: OnlyfoodzPost[] | object[] =
			await database.OnlyfoodzPosts.listAllPosts();
		posts.reverse();

		return reply.send(posts);
	},
};
