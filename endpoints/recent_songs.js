module.exports = {
	name: "spotify/recent",
	method: "GET",
	execute: async (req, res, database, Spotify) => {
		Spotify.getMyRecentlyPlayedTracks({
			limit: 20,
		}).then(
			async (data) => {
				if (!data.body.items)
					return res.status(500).json({
						error: "Unable to fetch recently played tracks.",
					});
				else res.status(200).json(data.body);
			},
			async (err) => {
				res.status(500).json({
					error: `${err}`,
				});
			}
		).catch(async (err) => {
            return res.status(500).json(err);
        });
	},
};
