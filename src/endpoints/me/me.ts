import { DecodedIdToken } from "firebase-admin/auth";
import { User } from "../../database/types.interface.js";

export default {
	name: "users/@me",
	method: "GET",
	execute: async (req, res, database, firebase) => {
		const token: DecodedIdToken = await firebase
			.auth()
			.verifyIdToken(req.query.token, true);
		const user: User = await database.Users.get({ userid: token.uid });

		if (user) return res.send(user);
		else
			return res.status(404).send({
				message:
					"We couldn't fetch any information about you in our database",
				token: req.query.token,
				error: true,
			});
	},
};
