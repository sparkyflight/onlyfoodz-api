import { User } from "../../database/types.interface.js";

export default {
	name: "validate/username",
	method: "GET",
	execute: async (req, res, database, firebase) => {
		const tag = req.query.tag;
		let user: User = await database.Users.get({ usertag: tag });

		if (user)
			return res.json({
				exists: true,
			});
		// it do be existing
		else
			return res.json({
				exists: false,
			}); // it do not be existing
	},
};
