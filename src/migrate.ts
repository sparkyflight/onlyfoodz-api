import * as v1 from "./v1-database/handler.js";
import { prisma } from "./v2-database/prisma.js";
import * as logger from "./logger.js";
import * as crypto from "crypto";

logger.info("Database V1", "Initializing...");
logger.info("Database V2", "Initializing...");
logger.info("Database Migration", "Getting Started...");

// Nuke all of the new database tables
Promise.all([
	prisma.plugins.deleteMany({}),
	prisma.commentPlugins.deleteMany({}),
	prisma.comments.deleteMany({}),
	prisma.posts.deleteMany({}),
	prisma.applications.deleteMany({}),
	prisma.users.deleteMany({}),
]);

setTimeout(async () => {
	// Fetch all data from old database.
	const oldApps = await v1.Applications.findAll();
	const oldOnlyfoodzPosts = await v1.OnlyfoodzPosts.findAll();
	const oldPosts = await v1.Posts.findAll();
	const oldUsers = await v1.Users.findAll();

	// Start Migration (Old => New)
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

	setTimeout(async () => {
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

			oldPost.plugins.forEach(async (plugin) => {
				await prisma.plugins.create({
					data: {
						postid: oldPost.postid,
						type: plugin.type,
						href: plugin.url,
					},
				});

				logger.success(
					"Plugins",
					`Migrated Post Plugins: ${oldPost.postid}`
				);
			});

			oldPost.comments.forEach(async (comment) => {
				await prisma.comments.create({
					data: {
						postid: oldPost.postid,
						commentid: crypto.randomUUID().toString(),
						creatorid: comment.user.userid,
						caption: comment.comment.caption,
						image: comment.comment.image,
					},
				});

				logger.success(
					"Comments",
					`Migrated Post Comment: ${oldPost.postid}`
				);
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

			oldOnlyfoodzPost.plugins.forEach(async (plugin) => {
				await prisma.plugins.create({
					data: {
						postid: oldOnlyfoodzPost.postid,
						type: plugin.type,
						href: plugin.url,
					},
				});

				logger.success(
					"Plugins",
					`Migrated Post Plugins: ${oldOnlyfoodzPost.postid}`
				);
			});

			oldOnlyfoodzPost.comments.forEach(async (comment) => {
				await prisma.comments.create({
					data: {
						postid: oldOnlyfoodzPost.postid,
						commentid: crypto.randomUUID().toString(),
						creatorid: comment.user.userid,
						caption: comment.comment.caption,
						image: comment.comment.image,
					},
				});

				logger.success(
					"Comments",
					`Migrated Post Comment: ${oldOnlyfoodzPost.postid}`
				);
			});

			logger.success(
				"Posts",
				`Migrated Onlyfoodz Post: ${oldOnlyfoodzPost.postid}`
			);
		});
	}, 2000);
}, 4000);
