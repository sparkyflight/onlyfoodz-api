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
                                    let allData = data.body;
                                    allData.items = [];

                                    data.body.items.forEach((item) => {
                                        let i = item;

                                        Spotify.getArtist(item.track.artists[0].id).then(async (i) => {
				             if (!i.body) i["artistData"] = {
						error: "Unable to fetch artist information.",
					     };
				             else i["artistData"] = i.body;
			                }, async (err) => {
                                             i["artistData"] = { error: err };
			                }).catch(async (err) => {
                                             i["artistData"] = { error: err };
                                        });

                                        allData["items"].push(i);
                                    });

                                    setTimeout(() => { res.status(200).json(allData); }, 3000);
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
