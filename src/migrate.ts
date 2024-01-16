import * as v1 from "./v1-database/handler.js";
import { prisma } from "./v2-database/prisma.js";
import * as logger from "./logger.js";

(async () => {
	const oldApps = await v1.Applications.findAll();
	const oldOnlyfoodzPosts = await v1.OnlyfoodzPosts.findAll();
	const oldPosts = await v1.Posts.findAll();
	const oldUsers = await v1.Users.findAll();

	oldApps.forEach(async (oldApp) => {
		await prisma.applications.create({
			data: {
				creatorid: oldApp.creatorid,
				name: oldApp.name,
				logo: oldApp.logo,
				token: oldApp.token,
				active: oldApp.active,
				permissions: oldApp.permissions,
			},
		});

		logger.success("Apps", `Migrated App: ${oldApp.name}`);
	});

	oldPosts.forEach(async (oldPost) => {
		await prisma.posts.create({
			data: {
				userid: oldPost.userid,
				caption: oldPost.caption,
				type: 0,
				image: oldPost.image,
				postid: oldPost.postid,
				upvotes: oldPost.upvotes,
				downvotes: oldPost.downvotes,
			},
		});

		logger.success(
			"Posts",
			`Migrated Sparkyflight Post: ${oldPost.postid}`
		);
	});

	oldOnlyfoodzPosts.forEach(async (oldOnlyfoodzPost) => {
		await prisma.posts.create({
			data: {
				userid: oldOnlyfoodzPost.userid,
				caption: oldOnlyfoodzPost.caption,
				type: 1,
				image: oldOnlyfoodzPost.image,
				postid: oldOnlyfoodzPost.postid,
				upvotes: oldOnlyfoodzPost.upvotes,
				downvotes: oldOnlyfoodzPost.downvotes,
			},
		});

		logger.success(
			"Posts",
			`Migrated Onlyfoodz Post: ${oldOnlyfoodzPost.postid}`
		);
	});

	oldUsers.forEach(async (oldUser) => {
		await prisma.users.create({
			data: {
				name: oldUser.name,
				userid: oldUser.userid,
				usertag: oldUser.usertag,
				bio: oldUser.bio,
				avatar: oldUser.avatar,
				followers: oldUser.followers,
				following: oldUser.following,
				badges: oldUser.badges,
				coins: oldUser.coins,
			},
		});

		logger.success("Users", `Migrated User: ${oldUser.userid}`);
	});
})();
