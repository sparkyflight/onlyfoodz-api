export default {
	name: "users/subscribe",
	method: "PUT",
	execute: async (req, res, database) => {
		const user = await database.Tokens.get(req.query.token);
		const target = await database.Users.get({ Tag: req.query.target });

		if (req.query.type === "sub") {
			if (user) {
				if (target) {
					if (target.Followers.includes(user.UserID))
						return res.json({
							error: "You cannot subscribe to this user again.",
						});
					else {
						const update = await database.Users.follow(
							user.UserID,
							target.UserID
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
					if (!target.Followers.includes(user.UserID))
						return res.json({
							error: "You cannot unsubcribe from this user. Reason: You are not subscribed to this user.",
						});
					else {
						const update = await database.Users.unfollow(
							user.UserID,
							target.UserID
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
