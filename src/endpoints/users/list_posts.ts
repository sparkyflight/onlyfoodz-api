import { User, OnlyfoodzPost } from "../../database/types.interface.js";

export default {
	name: "posts/list_user",
	method: "GET",
	execute: async (req, res, database, firebase) => {
		const tag = req.query.tag;
		let posts: OnlyfoodzPost[] | null;

		if (tag || tag != "") {
			let user: User = await database.Users.get({ usertag: tag });

			if (user) {
				posts = await database.OnlyfoodzPosts.getAllUserPosts(
					user.userid,
					1
				);
				posts.reverse();

				return res.json(posts);
			} else
				return res.status(404).send({
					message:
						"We couldn't fetch any information about this user in our database",
					error: true,
				});
		} else
			return res.status(404).json({
				error: "There was no user tag specified with the request.",
			});
	},
};
