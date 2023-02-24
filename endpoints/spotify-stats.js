module.exports = {
	name: "spotify/statistics",
	method: "GET",
	execute: async (req, res, database, Spotify, cloudinary) => {
            const topArtists = await Spotify.getMyTopArtists().then((res) => { return data.body.items }, (err) => { return error; }).catch((err) => { return err; });
            const topSongs = await Spotify.getMyTopSongs().then((res) => { return data.body.items }, (err) => { return error; }).catch((err) => { return err; });

            return res.json({
                topArtists: topArtists,
                topSongs: topSongs
            });
        }
};
