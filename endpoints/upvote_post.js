module.exports = {
	name: "posts/upvote",
	method: "PUT",
	execute: async (req, res, database, Spotify) => {
		const user = await database.Tokens.get(req.query.token);

		if (user) {
                    const update = await database.Posts.upvote(req.query.PostID, user.UserID);

                    if (update || !update.error) return res.json({
                       success: true
                    });
                    else return res.json({
                       success: false
                    });
                }
		else return res.json({
                   error: "The provided user token is invalid, or the user does not exist.",
                   success: false
                });
	},
};
