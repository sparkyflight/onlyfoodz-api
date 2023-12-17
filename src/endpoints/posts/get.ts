import { OnlyfoodzPost } from "../../database/types.interface.js";

export default {
	name: "posts/get",
	method: "GET",
	execute: async (req, res, database, firebase) => {
		const postid = req.query.post_id;

		if (postid || postid != "") {
			const post: OnlyfoodzPost = await database.OnlyfoodzPosts.get(
				postid
			);
			return res.json(post);
		} else
			return res.status(404).json({
				error: "You did not provide a valid Post ID.",
			});
	},
};
