// Packages
const Discord = require("discord-oauth2");
const crypto = require("node:crypto");
const fetch = require("node-fetch");
require("dotenv").config();

// Initalize Discord Oauth2
const discord = new Discord({
	clientId: process.env.DISCORD_CLIENT_ID,
	clientSecret: process.env.DISCORD_CLIENT_SECRET,
	redirectUri: "https://api.nightmarebot.tk/auth/discord/callback",
});

// Discord
class DiscordAuth {
	// Get the Authorization URL
	static async getAuthURL(redirect) {
		const state = JSON.stringify({
			redirect: redirect,
		});

		const url = discord.generateAuthUrl({
			scope: ["identify"],
			state: state,
			responseType: "code",
		});

		return url;
	}

	// Get the Access Token
	static async getAccessToken(code) {
		const token = await discord
			.tokenRequest({
				code: code,
				scope: ["identify"],
				grantType: "authorization_code",
			})
			.catch((err) => {
				return {
					error: err,
				};
			});

		return token;
	}

	// Get the Refresh Token
	static async getRefreshToken(refreshToken) {
		const token = await discord
			.tokenRequest({
				refreshToken: refreshToken,
				grantType: "refresh_token",
				scope: ["identify"],
			})
			.catch((err) => {
				return {
					error: err,
				};
			});

		return token;
	}

	// Revoke the Access Token
	static async revokeAccessToken(accessToken) {
		const credentials = Buffer.from(
			`${process.env.DISCORD_CLIENT_ID}:${process.env.DISCORD_CLIENT_SECRET}`
		).toString("base64");

		discord.revokeToken(accessToken, credentials).catch((err) => {
			return {
				error: err,
			};
		});

		return {
			success: true,
			message: "Access Token Revoked",
		};
	}

	// Get the User Info
	static async getUserInfo(accessToken) {
		const user = await discord.getUser(accessToken).catch((err) => {
			return {
				error: err,
			};
		});

		return user;
    }
}

// Github
class GithubAuth {
	static async getAuthURL(redirect) {
		const state = JSON.stringify({
			redirect,
			uuid: crypto.randomUUID(),
		});

		return `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&state=${state}`;
	}

	static async getAccessToken(code) {
		const token = await fetch(
			"https://github.com/login/oauth/access_token",
			{
				body: JSON.stringify({
					client_id: process.env.GITHUB_CLIENT_ID,
					client_secret: process.env.GITHUB_CLIENT_SECRET,
					code: code,
				}),
				headers: {
					"Content-Type": "application/json",
				},
                method: "POST"
			}
		).then((res) => res.json());

        return token;
	};

    static async getUserInfo(token) {
        const data = await fetch("https://api.github.com/user", {
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: `Bearer ${token}`,
                "X-Github-Api-Version": "2022-11-28"
            },
        }).then((res) => res.json());

        return data;
    };
}

// Expose Classes
module.exports = {
	discord: DiscordAuth,
	github: GithubAuth,
};
