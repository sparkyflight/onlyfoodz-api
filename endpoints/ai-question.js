const banana = require('@banana-dev/banana-dev');
require("dotenv").config();

module.exports = {
	name: "ai/question",
	method: "GET",
	execute: async (req, res, database, Spotify) => {
           const question = req.query.question;

           if (!question || question === "") return res.json({ error: "There was no question passed with request." });
           else {
              const banana = require('@banana-dev/banana-dev');

              const modelParameters = {
                 "text": question,
                 "length":250,
                 "temperature": 0.9,
                 "batchSize": 1
              }

              const output = await banana.run(process.env.BANANA_KEY, "gptj", modelParameters);
              if (output) return res.json(output);
              else return res.json({ error: "A unknown error occured while rendering your request" });
          }
       }
};
