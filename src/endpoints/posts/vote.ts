import { DecodedIdToken } from "firebase-admin/auth";
import { OnlyfoodzPost, User } from "../../database/types.interface.js";

export default {
	name: "posts/vote",
	method: "PUT",
	execute: async (req, res, database, firebase) => {
		const token: DecodedIdToken = await firebase
			.auth()
			.verifyIdToken(req.query.token, true);
		const user: User = await database.Users.get({ userid: token.uid });

		const post: OnlyfoodzPost = await database.OnlyfoodzPosts.get(
			req.query.PostID
		);

		if (req.query.type === "up") {
			if (user) {
				if (post) {
					if (
						post.upvotes.includes(user.userid) ||
						post.downvotes.includes(user.userid)
					)
						return res.json({
							error: "You cannot update your vote, for this post.",
						});
					else {
						const update = await database.OnlyfoodzPosts.upvote(
							req.query.PostID,
							user.userid
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
		}

		if (req.query.type === "down") {
			if (user) {
				if (post) {
					if (
						post.upvotes.includes(user.userid) ||
						post.downvotes.includes(user.userid)
					)
						return res.json({
							error: "You cannot update your vote, for this post.",
						});
					else {
						const update = await database.OnlyfoodzPosts.downvote(
							req.query.PostID,
							user.userid
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
		}
	},
};
