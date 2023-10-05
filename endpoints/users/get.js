module.exports = {
	name: "users/get",
	method: "GET",
	execute: async (req, res, database) => {
		const tag = req.query.tag;
		let user = await database.Users.get({ UserID: tag });

		user["team"] = false;
		user["Connections"] = [];

		if (!user || user.error) {
			user = await database.Teams.get({ UserID: tag });

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
