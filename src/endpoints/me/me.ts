import { User } from "../../database/types.interface.js";

export default {
	name: "users/@me",
	method: "GET",
	execute: async (req, res, database) => {
		const token: User = await database.Tokens.get(req.query.token);

		if (token) return res.send(token);
		else
			return res.status(404).send({
				message:
					"We couldn't fetch any information about you in our database",
				token: req.query.token,
				error: true,
			});
	},
};
