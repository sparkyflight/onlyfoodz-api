module.exports = {
	name: "spotify/playing",
	method: "GET",
	execute: async (req, res, database, Spotify) => {
                let allData;

		Spotify.getMyCurrentPlayingTrack().then(
			async (data) => {
				if (!data.body.item)
					return res.status(500).json({
						error: "Hmm, it looks like Select isn't listening to music at the moment. Please try again later!",
					});
				else {
                                        allData = data.body;

                                        Spotify.getArtist(data.body.item.artists[0].id).then(async (i) => {
				             if (!i.body) return allData.item.artistData = {
						error: "Unable to fetch artist information.",
					     };
				             else allData.item.artistData = i.body;
			                }, async (err) => {
                                             allData.item.artistData = { error: err };
			                }).catch(async (err) => {
                                            allData.item.artistData = { error: err };
                                        });

                                        res.status(200).json(allData); 
                                }
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
