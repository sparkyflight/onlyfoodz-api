import { DecodedIdToken } from "firebase-admin/auth";
import { User, OnlyfoodzPost } from "../../database/types.interface.js";

export default {
	name: "posts/comment",
	method: "POST",
	execute: async (req, res, database, firebase) => {
		const data = req.body;

		const token: DecodedIdToken = await firebase
			.auth()
			.verifyIdToken(data["user"].user_token, true);
		const user: User = await database.Users.get({ userid: token.uid });

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
