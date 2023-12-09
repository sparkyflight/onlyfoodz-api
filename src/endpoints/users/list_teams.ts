export default {
	name: "users/list_teams",
	method: "GET",
	execute: async (req, res, database) => {
		const tag = req.query.tag;

		if (tag || tag != "") {
			let user = await database.Users.get({ usertag: tag });
			let teams = await database.Teams.listUsersTeams(user.userid);

			if (teams.length === 0)
				return res.json({
					error: "Sorry, this user has no teams.",
				});
			else return res.json(teams);
		} else
			return res.status(404).json({
				error: "There was no user tag specified with the request.",
			});
	},
};
