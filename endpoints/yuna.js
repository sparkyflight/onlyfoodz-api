module.exports = {
	name: "easter/yuna",
	method: "GET",
	execute: async (req, res, database, Spotify) => {
          const content = ["https://images-ext-1.discordapp.net/external/_ABOeKUq02C-IjT0xBXzD4wAnmKNI9NZY6pemUxFYeA/https/media.tenor.com/oMWt1Z5sLtkAAAPo/itzy-yuna.mp4", "https://images-ext-1.discordapp.net/external/ZYtdl0ITUxQKbZa-e8HEU5CSj_f6-QdGzy-h3IjHu6w/https/media.tenor.com/_b_RFJNFXOIAAAPo/yuna-yuna-itzy.mp4", "https://images-ext-2.discordapp.net/external/jG_KRYbcOKf-I_EeMdK5lN4S0mFk_cdy2JKJyGTeDYY/https/media.tenor.com/LuYhzf2y9v4AAAPo/itzy-yuna.mp4"];
          const item = content[Math.floor(Math.random() * content.length)];

          res.redirect(item);
        }
};
