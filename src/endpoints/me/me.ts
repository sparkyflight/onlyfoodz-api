export default {
	name: "users/@me",
	method: "GET",
	execute: async (req, res, database) => {
		const token = await database.Tokens.get(req.query.token);

		if (token) {
			const user = await database.Users.get({ userid: token.userid });
			if (user) return res.send(user);
			else
				return res.status(404).send({
					message:
						"We couldn't fetch any information about you in our database",
					token: req.query.token,
					error: true,
				});
		} else
			return res.status(404).send({
				message:
					"We couldn't fetch any information about you in our database",
				token: req.query.token,
				error: true,
			});
	},
};
