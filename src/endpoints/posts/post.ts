import { User } from "../../database/types.interface.js";

export default {
	name: "posts/post",
	method: "POST",
	execute: async (req, res, database) => {
		const data = req.body;

		if (!data["user"])
			return res.json({
				error: "Oops, it seems that you are not logged in.",
			});
		else {
			let user: User = await database.Tokens.get(data["user"].user_token);

			if (user) {
				if (!data["caption"] || data["caption"].error)
					return res.json({
						success: false,
						error: "Sorry, a caption must be provided.",
					});

				await database.OnlyfoodzPosts.create(
					user.userid,
					data["caption"],
					data["image"],
					data["plugins"],
					1
				);

				return res.json({ success: true });
			} else {
				return res.json({
					success: false,
					error: "The user token was not passed with token.",
				});
			}
		}
	},
};
