import { DecodedIdToken } from "firebase-admin/auth";
import { OnlyfoodzPost, User } from "../../database/types.interface.js";
import { FastifyReply, FastifyRequest } from "fastify";
import * as database from "../../database/handler.js";
import firebase from "firebase-admin";

export default {
	url: "/posts/vote",
	method: "PUT",
	schema: {
		querystring: {
			type: "object",
			properties: {
				token: { type: "string" },
				PostID: { type: "string" },
				type: { type: "string" },
			},
			required: ["token", "PostID", "type"],
		},
	},
	handler: async (request: FastifyRequest, reply: FastifyReply) => {
		const { token, PostID, type }: any = request.query;
		const p: DecodedIdToken = await firebase
			.auth()
			.verifyIdToken(token, true);
		const user: User = await database.Users.get({ userid: p.uid });

		const post: { user: User; post: OnlyfoodzPost } =
			await database.OnlyfoodzPosts.get(PostID);

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
						const update = await database.OnlyfoodzPosts.upvote(
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
						const update = await database.OnlyfoodzPosts.downvote(
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
