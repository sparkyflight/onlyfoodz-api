module.exports = {
	name: "posts/list_user",
	method: "GET",
	execute: async (req, res, database, Spotify, cloudinary) => {
		const userid = req.query.user_id;
		const type = req.query.type;
		let posts;

		if (userid || userid != "") {
			if (type || type != "") {
				/*
                      1 = Onlyfoodz
                      2 = Regular
                   */

				if (type === "1")
					posts = await database.Posts.getAllUserPosts(userid, 1);
				else if (type === "2")
					posts = await database.Posts.getAllUserPosts(userid, 2);
				else
					posts = {
						error: "The provided type is invalid",
					};

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
