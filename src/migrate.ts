import { prisma } from "./v2-database/prisma.js";

// Let's get all users from the fatesdb
(async () => {
    const users = [

    ];
    const bots = [
        
    ];

    users.forEach(async (user) => {
        await prisma.users.create({
            data: {
                name: user.username,
	            userid: user.user_id,
	            usertag: user.username,
	            bio: user.description,
	            followers: [],
	            following: [],
	            badges: [],
	            staff_perms: [],
            }
        });
    });

    bots.forEach(async (bot) => {
        await prisma.discordbots.create({
            data: {
                botid: bot.bot_id,
	            name: bot.username_cached,
	            description: bot.description,
	            longdescription: bot.long_description,
	            status: "OFFLINE",
	            state: "PENDING",
	            upvotes: [],
	            downvotes: [],
	            ownerid: bot.bot_owner.find((p) => p.main === true).owner
            }
        });
    });
})();