module.exports = {
	name: "spotify/recent",
	method: "GET",
	execute: async (req, res, database, Spotify) => {
                Spotify.getMyRecentlyPlayedTracks({
		    limit: 10,
		}).then(
			async (data) => {
				if (!data.body.items)
					return res.status(500).json({
						error: "Unable to fetch recently played tracks.",
					});
				else {
                                    let allData;
                                    allData = data.body;
                                    allData["items"] = [];

                                    data.body.items.forEach((item) => {
                                        let p = item;

                                        Spotify.getArtist(item.track.artists[0].id).then(async (i) => {
				             if (!i.body) p["artistData"] = {
						error: "Unable to fetch artist information.",
					     };
				             else p["artistData"] = i.body;
			                }, async (err) => {
                                             p["artistData"] = { error: err };
			                }).catch(async (err) => {
                                             p["artistData"] = { error: err };
                                        });

                                        allData["items"].push(p);
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
