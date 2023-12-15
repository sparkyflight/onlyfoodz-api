import { Token, User } from "../../database/types.interface.js";

export default {
	name: "users/subscribe",
	method: "PUT",
	execute: async (req, res, database) => {
		const user: User = await database.Tokens.get(req.query.token);
		const target: User = await database.Users.get({
			usertag: req.query.target,
		});

		if (req.query.type === "sub") {
			if (user) {
				if (target) {
					if (target.subscribed.includes(user.userid))
						return res.json({
							error: "You cannot subscribe to this user again.",
						});
					else {
						const update = await database.Users.follow(
							user.userid,
							target.userid
						);

						if (update)
							return res.json({
								success: true,
							});
						else
							return res.json({
								error: "An unexpected error has occured while trying to complete your request.",
							});
					}
				} else
					return res.json({
						error: "The provided target user tag is invalid.",
					});
			} else
				return res.json({
					error: "The provided user token is invalid, or the user does not exist.",
				});
		}

		if (req.query.type === "unsub") {
			if (user) {
				if (target) {
					if (!target.subscribed.includes(user.userid))
						return res.json({
							error: "You cannot unsubcribe from this user. Reason: You are not subscribed to this user.",
						});
					else {
						const update = await database.Users.unfollow(
							user.userid,
							target.userid
						);

						if (update)
							return res.json({
								success: true,
							});
						else
							return res.json({
								error: "An unexpected error has occured while trying to complete your request.",
							});
					}
				} else
					return res.json({
						error: "The provided target user id is invalid.",
					});
			} else
				return res.json({
					error: "The provided user token is invalid, or the user does not exist.",
				});
		}
	},
};
