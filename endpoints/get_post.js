module.exports = {
	name: "posts/get",
	method: "GET",
	execute: async (req, res, database, Spotify) => {
		const postid = req.query.post_id;

		if (postid || postid != "") {
			const post = await database.Posts.get(postid);

			return res.json(post);
		} else
			return res.status(404).json({
				error: "You did not provide a valid Post ID.",
			});
	},
};
