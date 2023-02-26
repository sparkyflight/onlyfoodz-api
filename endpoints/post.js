const crypto = require("node:crypto");

module.exports = {
	name: "posts/post",
	method: "POST",
	execute: async (req, res, database, Spotify, cloudinary) => {
           const data = req.body;
           let response = {};

           if (!data["caption"] || data["caption"].error) return res.json({ error: "Sorry, a caption must be provided." });
           else if (data["image"]) {
              const imageString = `data:image/jpeg;base64,${data["image"]}`;
              const image = cloudinary.uploader.upload(imageString, {
                  public_id: crypto.randomUUID()
              });

              image.then((i) => {
                 response["image_uri"] = i.secure_url;
              }).catch((i) => { response["image_uri"] = null; });
           } else response["image_uri"] = null;

           return res.json(response);
        }
};
