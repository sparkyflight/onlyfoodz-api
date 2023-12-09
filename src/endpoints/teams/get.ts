export default {
	name: "teams/get",
	method: "GET",
	execute: async (req, res, database) => {
		const tag = req.query.tag;
		let team = await database.Teams.get({ usertag: tag });

		if (team) return res.send(team);
		else
			return res.status(404).send({
				error: "We couldn't fetch any information about this team in our database",
			});
	},
};
