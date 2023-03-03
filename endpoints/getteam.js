module.exports = {
	name: "teams/get",
	method: "GET",
	execute: async (req, res, database, Spotify) => {
		const userid = req.query.id;
		let team = await database.Teams.get({ UserID: userid });

		if (team || !team.error) res.send(team);
		else
			res.status(404).send({
				error: "We couldn't fetch any information about this team in our database",
			});
	},
};
