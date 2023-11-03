export default {
	name: "users/get",
	method: "GET",
	execute: async (req, res, database) => {
		const tag = req.query.tag;
		let user = await database.Users.get({ usertag: tag });

		if (user) user["team"] = false;

		if (!user || user.error) {
			user = await database.Teams.get({ usertag: tag });
			if (user || !user.error) user["team"] = true;
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
