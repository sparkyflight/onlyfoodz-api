module.exports = {
	name: "posts/list_user",
	method: "GET",
	execute: async (req, res, database, Spotify) => {
		const userid = req.query.user_id;
		const type = req.query.type;
		let posts;

		if (userid || type != "") {
			if (type || type != "") {
				switch (posts) {
					/*
                1 = Onlyfoodz
                2 = Regular
            */

					case "1":
						posts = await database.Posts.getAllUserPosts(userid, 1);
						break;

					case "2":
						posts = await database.Posts.getAllUserPosts(userid, 2);
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
		} else
			res.status(404).json({
				error: "There was no user id specified with the request.",
			});
	},
};
