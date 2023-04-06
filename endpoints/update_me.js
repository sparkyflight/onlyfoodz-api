module.exports = {
	name: "users/@me",
	method: "PATCH",
	execute: async (req, res, database, Spotify) => {
		let data = req.body;
		const user = await database.Tokens.get(data["token"]);

		if (user) {
			if (!data["username"] || data["username"] === "")
				return res.json({
					error: "A username is required.",
				});
			if (!data["avatar"] || data["avatar"] === "")
				return res.json({
					error: "A avatar is required.",
				});
			if (!data["bio"] || data["bio"] === "") data["bio"] = null;
			else {
				await database.Users.update(user.UserID, {
					Username: data["username"],
					Avatar: data["avatar"],
					Bio: data["bio"] || null,
				});

				return res.json({
					success: true,
				});
			}
		} else
			res.status(404).send({
				message:
					"We couldn't fetch any information about you in our database",
				token: data["token"],
				error: true,
			});
	},
};
