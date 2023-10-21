module.exports = {
	name: "posts/list_user",
	method: "GET",
	execute: async (req, res, database) => {
		const userid = req.query.user_id;
		let posts;

		if (userid || userid != "") {
			posts = await database.Posts.getAllUserPosts(userid, 1);
			posts.reverse();

			return res.json(posts);
		} else
			res.status(404).json({
				error: "There was no user id specified with the request.",
			});
	},
};
