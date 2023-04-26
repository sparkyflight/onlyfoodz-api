module.exports = {
	name: "posts/upvote",
	method: "PUT",
	execute: async (req, res, database, Spotify) => {
		const user = await database.Tokens.get(req.query.token);
		const post = await database.Posts.get(req.query.PostID);

		if (user) {
			if (post) {
				if (
					post.post.Upvotes.includes(user.UserID) ||
					post.post.Downvotes.includes(user.UserID)
				)
					return res.json({
						error: "You cannot update your vote, for this post.",
					});
				else {
					const update = await database.Posts.upvote(
						req.query.PostID,
						user.UserID
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
					error: "The provided post id is invalid.",
				});
		} else
			return res.json({
				error: "The provided user token is invalid, or the user does not exist.",
			});
	},
};
