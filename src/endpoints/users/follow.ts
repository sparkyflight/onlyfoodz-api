import { DecodedIdToken } from "firebase-admin/auth";
import { User } from "../../database/types.interface.js";

export default {
	name: "users/follow",
	method: "PUT",
	execute: async (req, res, database, firebase) => {
		const token: DecodedIdToken = await firebase
			.auth()
			.verifyIdToken(req.query.token, true);
		const user: User = await database.Users.get({ userid: token.uid });
		const target: User = await database.Users.get({
			userid: req.query.target,
		});

		if (req.query.type === "follow") {
			if (user) {
				if (target) {
					if (target.following.includes(user.userid))
						return res.json({
							error: "You cannot follow this user again.",
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

		if (req.query.type === "unfollow") {
			if (user) {
				if (target) {
					if (!target.followers.includes(user.userid))
						return res.json({
							error: "You cannot unfollow this user. Reason: You are not following to this user.",
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
