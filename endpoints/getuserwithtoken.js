module.exports = {
	name: "users/getwithtoken",
	method: "GET",
	execute: async (req, res, database, Spotify) => {
		const token = req.query.token;
		const tokenInfo = await database.Tokens.get(token);

		if (!tokenInfo)
			res.status(404).send({
				message:
					"We couldn't fetch any information about this user in our database",
				token: token,
				error: true,
				fatal: false,
			});

		const user = await database.Users.get({ UserID: tokenInfo.UserID });

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
