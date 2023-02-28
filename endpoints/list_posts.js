module.exports = {
	name: "posts/list",
	method: "GET",
	execute: async (req, res, database, Spotify) => {
		const type = req.query.type;
		let posts;

		if (type || type != "") {
			/*
                      1 = Onlyfoodz
                      2 = Regular
                   */

			if (type === "1") posts = await database.Posts.listAllPosts(1);
			else if (type === "2") posts = await database.Posts.listAllPosts(2);
			else
				posts = {
					error: "The provided type is invalid",
				};

			return res.json(posts);
		} else
			res.status(404).json({
				error: "There was no post type specified with the request.",
			});
	},
};
