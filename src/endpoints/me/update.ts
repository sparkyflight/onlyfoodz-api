import { DecodedIdToken } from "firebase-admin/auth";
import { User } from "../../database/types.interface.js";

export default {
	name: "users/@me",
	method: "PATCH",
	execute: async (req, res, database, firebase) => {
		let data = req.body;

		const token: DecodedIdToken = await firebase
			.auth()
			.verifyIdToken(data["token"], true);
		const user: User = await database.Users.get({ userid: token.uid });

		if (user) {
			if (!data["name"] || data["name"] === "")
				return res.json({
					error: "A name is required.",
				});
			if (!data["avatar"] || data["avatar"] === "")
				return res.json({
					error: "A avatar is required.",
				});

			if (!data["bio"] || data["bio"] === "") data["bio"] = null;

			await database.Users.updateUser(user.userid, {
				name: data["name"],
				avatar: data["avatar"],
				bio: data["bio"] || null,
			});

			return res.json({
				success: true,
			});
		} else
			res.status(404).send({
				message:
					"We couldn't fetch any information about you in our database",
				token: data["token"],
				error: true,
			});
	},
};
