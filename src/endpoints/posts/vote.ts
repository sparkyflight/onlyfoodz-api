import { OnlyfoodzPost, Post, User } from "../../database/types.interface.js";
import { FastifyReply, FastifyRequest } from "fastify";
import * as database from "../../database/handler.js";
import { getAuth } from "../../auth.js";

export default {
	url: "/posts/vote",
	method: "PUT",
	schema: {
		summary: "Vote on post",
		description: "Votes on a post.",
		tags: ["posts"],
		querystring: {
			type: "object",
			properties: {
				PostID: { type: "string" },
				type: { type: "string" },
			},
			required: ["PostID", "type"],
		},
		security: [
			{
				apiKey: [],
			},
		],
	},
	handler: async (request: FastifyRequest, reply: FastifyReply) => {
		const { PostID, type }: any = request.query;
		const Authorization: any = request.headers.authorization;
		const user: User | null = await getAuth(Authorization, "posts.vote");

		let postType: string = "Posts";
		let post: { user: User; post: Post | OnlyfoodzPost } =
			await database.Posts.get(PostID);

		if (!post) {
			post = await database.OnlyfoodzPosts.get(PostID);

			postType = "OnlyfoodzPosts";
		}

		if (type === "up") {
			if (user) {
				if (post) {
					if (
						post.post.upvotes.includes(user.userid) ||
						post.post.downvotes.includes(user.userid)
					)
						return reply.send({
							error: "You cannot update your vote, for this post.",
						});
					else {
						const update = await database[postType].upvote(
							PostID,
							user.userid
						);

						if (update)
							return reply.send({
								success: true,
							});
						else
							return reply.send({
								error: "An unexpected error has occured while trying to complete your request.",
							});
					}
				} else
					return reply.send({
						error: "The provided post id is invalid.",
					});
			} else
				return reply.send({
					error: "The provided user token is invalid, or the user does not exist.",
				});
		}

		if (type === "down") {
			if (user) {
				if (post) {
					if (
						post.post.upvotes.includes(user.userid) ||
						post.post.downvotes.includes(user.userid)
					)
						return reply.send({
							error: "You cannot update your vote, for this post.",
						});
					else {
						const update = await database[postType].downvote(
							PostID,
							user.userid
						);

						if (update)
							return reply.send({
								success: true,
							});
						else
							return reply.send({
								error: "An unexpected error has occured while trying to complete your request.",
							});
					}
				} else
					return reply.send({
						error: "The provided post id is invalid.",
					});
			} else
				return reply.send({
					error: "The provided user token is invalid, or the user does not exist.",
				});
		}
	},
};
