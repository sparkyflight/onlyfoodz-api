export default {
	name: "posts/comment",
	method: "POST",
	execute: async (req, res, database) => {
		const data = req.body;

		const user = await database.Tokens.get(req.query.token);
		const post = await database.Posts.get(req.query.PostID);

		if (user) {
			if (post) {
				const update = await database.Posts.comment(
					post.postid,
					user.userid,
					data["Caption"]
				);

				if (update) return res.json({ success: true });
				else
					return res.json({
						error: "Something went wrong with processing your request.",
					});
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
