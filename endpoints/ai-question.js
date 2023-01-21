module.exports = {
	name: "ai/question",
	method: "GET",
	execute: async (req, res, database, Spotify) => {
           const question = req.query.question;

           if (!question || question === "") return res.json({ error: "There was no question passed with request." });
           else {
           }
        }
};
