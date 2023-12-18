import { DecodedIdToken } from "firebase-admin/auth";
import { User } from "../../database/types.interface.js";

export default {
	name: "users/subscribe",
	method: "PUT",
	execute: async (req, res, database, firebase) => {
		const token: DecodedIdToken = await firebase
			.auth()
			.verifyIdToken(req.query.token, true);
		const user: User = await database.Users.get({ userid: token.uid });
		const target: User = await database.Users.get({
			userid: req.query.target,
		});

		if (req.query.type === "sub") {
			if (user) {
				if (target) {
					if (target.subscribed.includes(user.userid))
						return res.json({
							error: "You cannot subscribe to this user again.",
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

		if (req.query.type === "unsub") {
			if (user) {
				if (target) {
					if (!target.subscribers.includes(user.userid))
						return res.json({
							error: "You cannot unsubcribe from this user. Reason: You are not subscribed to this user.",
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
