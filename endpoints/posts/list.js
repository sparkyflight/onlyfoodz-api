module.exports = {
	name: "posts/list",
	method: "GET",
	execute: async (req, res, database) => {
		let posts = await database.Posts.listAllPosts(1);
		posts.reverse();

		return res.json(posts);
	},
};
