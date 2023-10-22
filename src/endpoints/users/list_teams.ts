export default {
	name: "users/list_teams",
	method: "GET",
	execute: async (req, res, database) => {
		const teams = await database.Teams.listUsersTeams(req.query.id);

		if (teams.length === 0)
			return res.json({
				error: "Sorry, this user has no teams.",
			});
		else return res.json(teams);
	},
};
