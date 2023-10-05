const crypto = require("node:crypto");

module.exports = {
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

				await database.Teams.create(
					data["Username"],
					crypto.randomUUID(),
					data["Bio"],
					data["Avatar"],
					user.UserID
				);

				return res.json({ success: true });
			}
		}
	},
};
