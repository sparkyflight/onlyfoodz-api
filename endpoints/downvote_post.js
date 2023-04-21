module.exports = {
	name: "posts/downvote",
	method: "PUT",
	execute: async (req, res, database, Spotify) => {
		const user = await database.Tokens.get(req.query.token);

		if (user) {
                    const update = await database.Posts.downvote(req.query.PostID, user.UserID);

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
