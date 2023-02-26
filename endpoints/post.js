const crypto = require("node:crypto");

module.exports = {
	name: "posts/post",
	method: "POST",
	execute: async (req, res, database, Spotify, cloudinary) => {
           const data = req.body;
           let response = {};

           if (!data["user"]) return res.json({ error: "Oops, it seems that you are not logged in." });
           if (!data["caption"] || data["caption"].error) return res.json({ error: "Sorry, a caption must be provided." });
           
           if (data["image"]) {
              const imageString = `data:image/jpeg;base64,${data["image"]}`;
              const image = cloudinary.uploader.upload(imageString, {
                  public_id: crypto.randomUUID()
              });

              image.then((i) => {
                 await database.Posts.create(data["user"], data["caption"], i.secure_url, [], 1);
                 return res.json({ success: true });
              }).catch((i) => { response["image_uri"] = null; });
           } else {
               await database.Posts.create(data["user"], data["caption"], null, [], 1);
               return res.json({ success: true });
           };
        }
};
