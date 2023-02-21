const banana = require("@banana-dev/banana-dev");
require("dotenv").config();

module.exports = {
	name: "ai/question",
	method: "GET",
	execute: async (req, res, database, Spotify, cloudinary) => {
		const question = req.query.question;

		if (!question || question === "")
			return res.json({
				error: "There was no question passed with request.",
			});
		else {
			const banana = require("@banana-dev/banana-dev");

			const modelParameters = {
				text: question,
				length: 200,
				temperature: 0.5,
				batchSize: 1,
			};

			const output = await banana.run(
				process.env.BANANA_TOKEN,
				"gptj",
				modelParameters
			);
			if (output) return res.json(output);
			else
				return res.json({
					error: "A unknown error occured while rendering your request",
				});
		}
	},
};
