module.exports = {
	name: "users/@me",
	method: "GET",
	execute: async (req, res, database) => {
		const token = req.query.token;
		const user = await database.Tokens.get(token);

		if (user) res.send(user);
		else
			res.status(404).send({
				message:
					"We couldn't fetch any information about you in our database",
				token: token,
				error: true,
			});
	},
};
