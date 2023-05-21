module.exports = {
	name: "users/get",
	method: "GET",
	execute: async (req, res, database, Spotify) => {
		const tag = req.query.tag;
		let user = await database.Users.get({ Tag: tag });

		user["team"] = false;
		user["Connections"] = [];

		if (!user || user.error) {
			user = await database.Teams.get({ Tag: tag });

			if (user || !user.error) {
				user["team"] = true;
				user["Connections"] = [];
			}
		}

		if (user || !user.error) res.send(user);
		else
			res.status(404).send({
				message:
					"We couldn't fetch any information about this user in our database",
				error: true,
			});
	},
};
