module.exports = { 
         name: "posts/comment", 
         method: "POST", 
         execute: async (req, res, database, Spotify) => {
             const user = await database.Tokens.get(req.query.token); 
             const post = await database.Posts.get(req.query.PostID); 
  
             if (user) { 
                 if (post) {}
                 else return res.json({ 
                   error: "The provided post id is invalid."
                 }); 
             } else 
                return res.json({ 
                  error: "The provided user token is invalid, or the user does not exist.", 
                });
         }
};
