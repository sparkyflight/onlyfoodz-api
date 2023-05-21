module.exports = {
	name: "users/follow",
	method: "PUT",
	execute: async (req, res, database, Spotify) => {
		const user = await database.Tokens.get(req.query.token);
		const target = await database.Users.get({ Tag: req.query.target });

		if (user) {
			if (target) {
				if (target.Followers.includes(user.UserID))
					return res.json({
						error: "You cannot follow this user again.",
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
	},
};
