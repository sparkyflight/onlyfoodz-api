module.exports = {
	name: "spotify/playing",
	method: "GET",
	execute: async (req, res, fetch, database, Spotify) => {
		client.Spotify.getMyCurrentPlayingTrack().then(
			async (data) => {
				if (!data.body.item)
					return res
						.status(502)
						.json({
							error: "It looks like that user is listening to music, at this time.",
						});
				else res.status(200).json(data);
			},
			async (err) => {
				res.status(502).json(err);
			}
		);
	},
};
