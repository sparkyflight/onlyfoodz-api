const crypto = require("node:crypto");

module.exports = {
	name: "posts/post",
	method: "POST",
	execute: async (req, res, database, Spotify, cloudinary) => {
           const data = req.body;
           let response = {};

           if (data["image"]) {
              const image = cloudinary.uploader.upload(data["image"], {public_id: crypto.randomUUID()})

              image.then((i) => {
                 response["image_uri"] = i.secure_url;
              }).catch(console.error);
           } else response["image_uri"] = null;

           response["caption"] = data["caption"];

           return res.json(response);
        }
};
