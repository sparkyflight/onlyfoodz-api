module.exports = {
	name: "teams/get",
	method: "GET",
	execute: async (req, res, database) => {
		const tag = req.query.tag;
		let team = await database.Teams.get({ Tag: tag });

		if (team || !team.error) res.send(team);
		else
			res.status(404).send({
				error: "We couldn't fetch any information about this team in our database",
			});
	},
};
