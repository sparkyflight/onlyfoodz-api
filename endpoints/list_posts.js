module.exports = {
	name: "posts/list",
	method: "GET",
	execute: async (req, res, database, Spotify) => {
		const type = req.query.type;
		let posts;

		if (type || type != "") {
			switch (posts) {
				/*
                1 = Onlyfoodz
                2 = Regular
            */

				case "1":
					posts = await database.Posts.listAllPosts(1);
					break;

				case "2":
					posts = await database.Posts.listAllPosts(2);
					break;

				default:
					posts = {
						error: "The provided type is invalid",
					};
					break;
			}

			return res.json(posts);
		} else
			res.status(404).json({
				error: "There was no post type specified with the request.",
			});
	},
};
