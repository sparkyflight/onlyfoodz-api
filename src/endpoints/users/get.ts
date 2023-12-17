import { User } from "../../database/types.interface.js";

export default {
	name: "users/get",
	method: "GET",
	execute: async (req, res, database, firebase) => {
		const tag = req.query.tag;
		let user: User = await database.Users.get({ usertag: tag });

		if (user) return res.send(user);
		else
			return res.status(404).send({
				message:
					"We couldn't fetch any information about this user in our database",
				error: true,
			});
	},
};
