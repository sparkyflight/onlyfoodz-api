module.exports = {
	name: "posts/post",
	method: "PATCH",
	execute: async (req, res, database) => {
		const data = req.body;

		if (!data["user"])
			return res.json({
				error: "Oops, it seems that you are not logged in.",
			});
		if (!data["post_id"])
			return res.json({
				error: "Oops, it seems that you did not pass the Post ID.",
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
					if (team || team.error) {
						if (team.Members.find((i) => i.ID === poster.UserID))
							user = team;
						else user = null;
					} else user = null;
				} else user = null;
			} else user = await database.Tokens.get(data["user"].user_token);

			if (user) {
				const origPost = await database.Posts.get(data["post_id"]);

				if (origPost) {
					if (origPost.UserID === user.UserID) {
						if (!data["caption"] || data["caption"].error)
							return res.json({
								success: false,
								error: "Sorry, a caption must be provided.",
							});

						await database.Posts.update(data["post_id"], {
							Caption: data["caption"],
							Image: data["image"] || null,
							Plugins: data["plugins"] || [],
						});

						return res.json({ success: true });
					} else
						return res.json({
							success: false,
							error: "You are NOT the author of this post. Access denied.",
						});
				} else
					res.json({
						success: false,
						error: "The Post ID provided is invalid.",
					});
			} else {
				return res.json({
					success: false,
					error: "The user token was not passed with token.",
				});
			}
		}
	},
};
