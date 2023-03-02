const crypto = require("node:crypto");

module.exports = {
	name: "posts/post",
	method: "POST",
	execute: async (req, res, database, Spotify) => {
		const data = req.body;
		let response = {};

		if (!data["user"])
			return res.json({
				error: "Oops, it seems that you are not logged in.",
			});
		else {
			let user;

			if (data["user"].team) {
				const team = await database.Teams.get({
					UserID: data["user"].user,
				});
				const poster = await database.Tokens.get(
					data["user"].user_token
				);

				if (poster || !poster.error) {
					if (i || !i.error) {
						if (team.Members.find((i) => i.ID === poster.UserID))
							user = team;
						else user = null;
					} else user = null;
				} else user = null;
			} else user = await database.Tokens.get(data["user"].user_token);

			if (user) {
				if (!data["caption"] || data["caption"].error)
					return res.json({
						success: false,
						error: "Sorry, a caption must be provided.",
					});

				await database.Posts.create(
					user.UserID,
					data["caption"],
					data["image"],
					[],
					1
				);
			} else {
				return res.json({
					success: false,
					error: "The user token was not passed with token.",
				});
			}
		}
	},
};
