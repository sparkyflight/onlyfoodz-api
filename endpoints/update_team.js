module.exports = {
	name: "teams/update",
	method: "PATCH",
	execute: async (req, res, database, Spotify) => {
		const data = req.body;

		if (!data["user"])
			return res.json({
				error: "Oops, it seems that you are not logged in.",
			});
		else {
			const user = await database.Tokens.get(data["user"]);

			if (!user)
				return res.json({
					error: "Uh oh, it seems that your User Token is invalid; or has expired. To fix this issue, simply relogin.",
				});
			else {
				const team = await database.Teams.get({
					UserID: data["team"],
				});

				if (team || team.error) {
					if (team.Members.find((i) => i.ID === user.UserID)) {
						if (!data["Username"])
							return res.json({
								error: "You must provide a valid username.",
							});

						if (!data["Bio"])
							return res.json({
								error: "You must provide a valid Bio/Description.",
							});

						if (!data["Avatar"])
							return res.json({
								error: "You must provide a Profile Picture.",
							});

						await database.Teams.update(data["team"], {
							Username: data["Username"],
							Bio: data["Bio"],
							Avatar: data["Avatar"],
						});

						return res.json({
							success: true,
						});
					} else
						return res.json({
							error: "You are not in this team.",
						});
				} else
					return res.json({
						error: "We are having issues accessing this team, at this time.",
					});
			}
		}
	},
};
