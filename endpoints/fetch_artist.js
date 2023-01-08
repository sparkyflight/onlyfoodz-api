module.exports = {
	name: "spotify/fetch_artist",
	method: "GET",
	execute: async (req, res, database, Spotify) => {
        const artistID = req.query.id;

        if (artistID === "" || artistID === null) return res.status(404).json({
            error: "You must specify the Artist ID."
        });

		Spotify.getArtist(artistID).then(
			async (data) => {
				if (!data.body)
					return res.status(500).json({
						error: "Unable to fetch artist information.",
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
