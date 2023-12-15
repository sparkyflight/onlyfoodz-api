import { User, OnlyfoodzPost, Token } from "../../database/types.interface.js";

export default {
	name: "posts/comment",
	method: "POST",
	execute: async (req, res, database) => {
		const data = req.body;

		let user: User = await database.Tokens.get(data["user"].user_token);
		const post: OnlyfoodzPost = await database.OnlyfoodzPosts.get(
			req.query.PostID
		);

		if (user) {
			if (post) {
				const update = await database.OnlyfoodzPosts.comment(
					post,
					user,
					data["Caption"],
					data["Image"]
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
