module.exports = {
	name: "users/getwithtoken",
	method: "GET",
	execute: async (req, res, database, Spotify, cloudinary) => {
		const token = req.query.token;
		const user = await database.Tokens.get(token);

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
