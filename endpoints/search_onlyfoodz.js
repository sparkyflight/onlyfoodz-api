module.exports = { 
         name: "onlyfoodz/search", 
         method: "GET", 
         execute: async (req, res, database, Spotify) => { 
                 const query = req.query.query; 

                 const users = await database.Users.find({
                   Username: {
                      $regex: query,
                      $options: "i"
                   }
                 });
  
                 const posts = await database.Posts.find({
                   Caption: {
                      $regex: query,
                      $options: "i"
                   }
                 });

                 return res.json({ users, posts });
         }, 
 };
