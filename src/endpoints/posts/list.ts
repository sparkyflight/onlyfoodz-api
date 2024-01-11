import { OnlyfoodzPost, Post } from "../../database/types.interface.js";
import * as database from "../../database/handler.js";
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
		let sparkyflight: Post[] | object[] =
			await database.Posts.listAllPosts();
		sparkyflight.reverse();

		let onlyfoodz: OnlyfoodzPost[] | object[] =
			await database.OnlyfoodzPosts.listAllPosts();
		onlyfoodz.reverse();

		return reply.send({
			sparkyflight: sparkyflight,
			onlyfoodz: onlyfoodz,
		});
	},
};
