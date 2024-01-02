import { User } from "../../database/types.interface.js";
import { FastifyReply, FastifyRequest } from "fastify";
import * as database from "../../database/handler.js";
import { getAuth } from "../../auth.js";

export default {
	url: "/users/follow",
	method: "PUT",
	schema: {
		querystring: {
			type: "object",
			properties: {
				target: { type: "string" },
				type: { type: "string" },
			},
			required: ["target", "type"],
		},
		security: [
			{
				apiKey: [],
			},
		],
	},
	handler: async (request: FastifyRequest, reply: FastifyReply) => {
		const data: any = request.query;
		const Authorization: any = request.headers.authorization;
		const user: User | null = await getAuth(Authorization);
		const target: User = await database.Users.get({
			userid: data.target,
		});

		if (data.type === "follow") {
			if (user) {
				if (target) {
					if (target.following.includes(user.userid))
						return reply.send({
							error: "You cannot follow this user again.",
						});
					else {
						const update = await database.Users.follow(
							user.userid,
							target.userid
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
						error: "The provided target user tag is invalid.",
					});
			} else
				return reply.send({
					error: "The provided user token is invalid, or the user does not exist.",
				});
		}

		if (data.type === "unfollow") {
			if (user) {
				if (target) {
					if (!target.followers.includes(user.userid))
						return reply.send({
							error: "You cannot unfollow this user. Reason: You are not following to this user.",
						});
					else {
						const update = await database.Users.unfollow(
							user.userid,
							target.userid
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
						error: "The provided target user id is invalid.",
					});
			} else
				return reply.send({
					error: "The provided user token is invalid, or the user does not exist.",
				});
		}
	},
};
