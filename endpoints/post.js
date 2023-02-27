const crypto = require("node:crypto");

module.exports = {
	name: "posts/post",
	method: "POST",
	execute: async (req, res, database, Spotify, cloudinary) => {
		const data = req.body;
		let response = {};

		if (!data["user"])
			return res.json({
				error: "Oops, it seems that you are not logged in.",
			});
		else {
			let user = await database.Tokens.get(data["user"]);
                        if (!user || user.error) user = await database.Teams.get({ UserID: data["user"] });

			if (user) {
				if (!data["caption"] || data["caption"].error)
					return res.json({
						success: false,
						error: "Sorry, a caption must be provided.",
					});

				if (data["image"]) {
					const imageString = `data:image/jpeg;base64,${data["image"]}`;
					const image = cloudinary.uploader.upload(imageString, {
						public_id: crypto.randomUUID(),
					});

					image
						.then(async (i) => {
							await database.Posts.create(
								user.UserID,
								data["caption"],
								i.secure_url,
								[],
								1
							);
							return res.json({ success: true });
						})
						.catch(async (i) => {
							await database.Posts.create(
								user.UserID,
								data["caption"],
								null,
								[],
								1
							);
							return res.json({ success: true });
						});
				} else {
					await database.Posts.create(
						user.UserID,
						data["caption"],
						null,
						[],
						1
					);
					return res.json({ success: true });
				}
			} else {
				return res.json({
					success: false,
					error: "The user token was not passed with token.",
				});
			}
		}
	},
};
