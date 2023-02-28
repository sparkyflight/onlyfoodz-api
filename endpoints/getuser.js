module.exports = {
	name: "users/get",
	method: "GET",
	execute: async (req, res, database, Spotify) => {
		const userid = req.query.id;
		let user = await database.Users.get({ UserID: userid });

		if (!user || user.error)
			user = await database.Teams.get({ UserID: userid });

		if (user || !user.error) res.send(user);
		else
			res.status(404).send({
				message:
					"We couldn't fetch any information about this user in our database",
				error: true,
			});
	},
};
