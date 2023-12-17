import { OnlyfoodzPost } from "../../database/types.interface.js";

export default {
	name: "posts/list",
	method: "GET",
	execute: async (req, res, database, firebase) => {
		let posts: OnlyfoodzPost[] = await database.OnlyfoodzPosts.listAllPosts(
			1
		);
		posts.reverse();

		return res.json(posts);
	},
};
