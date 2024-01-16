import * as v1 from "./v1-database/handler.js";
import * as v2 from "./v2-database/prisma.js";
import type * as oldtypes from "./v1-database/types.interface.js";
import type * as newtypes from "./v2-database/types/prismaTypes.js";
import * as logger from "./logger.js";

(async() => {
    const oldApps = await v1.Applications.findAll();
    const oldOnlyfoodzPosts = await v1.OnlyfoodzPosts.findAll();
    const oldPosts = await v1.Posts.findAll();
    const oldUsers = await v1.Users.findAll();
})();