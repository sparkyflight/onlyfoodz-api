import * as database from "../../v2-database/prisma.js";
import { FastifyReply, FastifyRequest } from "fastify";

export default {
	url: "/posts/list",
	method: "GET",
	schema: {
		summary: "Get all posts",
		description: "Returns all posts.",
		tags: ["posts"],
	},
	handler: async (request: FastifyRequest, reply: FastifyReply) => {
		let posts = await database.Posts.listAllPosts();
		posts.reverse();

		return reply.send(posts);
	},
};
