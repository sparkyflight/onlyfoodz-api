export default {
	name: "teams/create",
	method: "POST",
	execute: async (req, res, database) => {
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
				if (!data["username"])
					return res.json({
						error: "You must provide a valid username.",
					});

				if (!data["usertag"])
					return res.json({
						error: "You must provide a valid User Tag.",
					});

				if (!data["bio"])
					return res.json({
						error: "You must provide a valid Bio/Description.",
					});

				if (!data["avatar"])
					return res.json({
						error: "You must provide a Profile Picture.",
					});

				await database.Teams.createTeam(
					data["username"],
					crypto.randomUUID(),
					data["usertag"],
					data["bio"],
					data["avatar"],
					user.userid
				);

				return res.json({ success: true });
			}
		}
	},
};
