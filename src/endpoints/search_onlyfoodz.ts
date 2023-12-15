export default {
	name: "onlyfoodz/search",
	method: "GET",
	execute: async (req, res, database) => {
		const query = req.query.query;

		const users = await database.Users.find({
			Username: {
				$regex: query,
				$options: "i",
			},
		});

		const posts = await database.OnlyfoodzPosts.find(
			{
				Caption: {
					$regex: query,
					$options: "i",
				},
			},
			1
		);

		return res.json({ users, posts });
	},
};
