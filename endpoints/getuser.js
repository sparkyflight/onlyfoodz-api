module.exports = {
	name: "users/get",
	method: "GET",
	execute: async (req, res, database, Spotify, cloudinary) => {
		const userid = req.query.id;
		const user = await database.Users.get({ UserID: userid });

		if (user) res.send(user);
		else
			res.status(404).send({
				message:
					"We couldn't fetch any information about this user in our database",
				token: token,
				error: true,
				fatal: false,
			});
	},
};
